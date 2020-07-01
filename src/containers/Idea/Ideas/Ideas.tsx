import { Box, Tab, Tabs } from '@material-ui/core';
import { CollapseIconSkeleton } from 'components';
import { IdeaRow } from 'containers';
import firebase from 'firebase/app';
import 'firebase/auth';
import { IdeaFilter, User } from 'models';
import qs from 'qs';
import React from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';
import { useUser } from 'reactfire';
import {
  createFetchIdeas,
  createFetchMoreIdeas,
  createSetIdeas,
  IdeasState,
  selectIdeas,
  State,
  useActions,
  useThunkActions,
} from 'services';
import { ideaListItemHeight } from 'styles';
import { IdeaOptionsSkeleton } from '../IdeaOptionsSkeleton';

export interface IdeasProps extends Pick<IdeasState, 'ideas'> {}

export const IdeasComponent: React.FC<IdeasProps> = ({ ideas }) => {
  const { setIdeas } = useActions({ setIdeas: createSetIdeas });

  const { fetchIdeas, fetchMoreIdeas } = useThunkActions({
    fetchIdeas: createFetchIdeas,
    fetchMoreIdeas: createFetchMoreIdeas,
  });

  const rowCount = ideas.includes(undefined)
    ? ideas.filter(Boolean).length
    : 1000;

  const listWrapperRef = React.useRef<HTMLDivElement | null>(null);

  const [listWrapperHeight, setListWrapperHeight] = React.useState<
    React.CSSProperties['height']
  >('auto');

  React.useEffect(() => {
    if (listWrapperRef.current) {
      const { top } = listWrapperRef.current.getBoundingClientRect();

      setListWrapperHeight(window.innerHeight - top);
    }
  }, []);

  const history = useHistory();

  const user = useUser<User>(firebase.auth());

  const query = qs.parse(useLocation().search, { ignoreQueryPrefix: true });

  const showMyIdeas = query.author === user?.email;

  const myIdeasFilter: IdeaFilter<'author'> = {
    fieldPath: 'author',
    opStr: '==',
    value: user?.email || '',
  };

  const publishedFilter: IdeaFilter<'status'> = {
    fieldPath: 'status',
    opStr: '==',
    value: 'sprout',
  };

  const filter = showMyIdeas ? myIdeasFilter : publishedFilter;

  const infiniteLoaderRef = React.useRef<InfiniteLoader | null>(null);

  const reset = () => {
    setIdeas({ ideas: [] });

    infiniteLoaderRef.current?.resetLoadMoreRowsCache();
  };

  const [activeTab, setActiveTab] = React.useState(Number(showMyIdeas));

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(e, value) => {
          setActiveTab(value);
        }}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab
          label="Discover"
          onClick={() => {
            reset();

            history.push({
              search: qs.stringify({}),
            });
          }}
        />
        <Tab
          label="Your Ideas"
          onClick={() => {
            reset();

            history.push({
              search: qs.stringify({ author: user?.email }),
            });
          }}
        />
      </Tabs>
      <div ref={listWrapperRef} style={{ height: listWrapperHeight }}>
        <InfiniteLoader
          ref={infiniteLoaderRef}
          loadMoreRows={(indexRange) => {
            const fetchOptions = { ...filter, ...indexRange };

            return ideas.length === 0
              ? fetchIdeas(fetchOptions)
              : fetchMoreIdeas(fetchOptions);
          }}
          isRowLoaded={({ index }) => {
            return !!ideas[index];
          }}
          rowCount={rowCount}
        >
          {({ onRowsRendered, registerChild }) => (
            <AutoSizer>
              {({ width, height }) => (
                <List
                  rowCount={rowCount}
                  ref={registerChild}
                  onRowsRendered={onRowsRendered}
                  width={width}
                  height={height}
                  rowHeight={ideaListItemHeight}
                  rowRenderer={({ key, index, style }) => {
                    const idea = ideas[index];

                    return (
                      <Box key={key} style={style}>
                        {!idea ? null : idea === 'loading' ? (
                          <IdeaOptionsSkeleton
                            secondaryActionIcon={<CollapseIconSkeleton />}
                          />
                        ) : idea instanceof Error ? (
                          <Box>Failed to load idea</Box>
                        ) : (
                          <IdeaRow key={idea.id} idea={idea} user={user} />
                        )}
                      </Box>
                    );
                  }}
                />
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
      </div>
    </Box>
  );
};

export const Ideas = connect((state: State) => {
  // * useSelector was returning "[]" instead of "['loading', 'loading', 'loading'...]"
  // * hence the loading state was not being rendered between filter updates
  return { ideas: selectIdeas(state) };
})(IdeasComponent);
