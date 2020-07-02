import { Box, Tab, Tabs, Typography } from '@material-ui/core';
import { IdeaRow } from 'containers';
import { IdeaFilter } from 'models';
import qs from 'qs';
import React from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';
import {
  createFetchIdeas,
  createFetchMoreIdeas,
  createSetIdeas,
  createSetTotal,
  IdeasState,
  initialIdeasState,
  selectIdeas,
  selectTotal,
  State,
  useActions,
  useSignedInUser,
  useThunkActions,
} from 'services';
import { ideaListItemFullHeight } from 'styles';
import { IdeaOptionsSkeleton } from '../IdeaOptionsSkeleton';

export interface IdeasProps extends Pick<IdeasState, 'ideas' | 'total'> {}

export const IdeasComponent: React.FC<IdeasProps> = ({ ideas, total }) => {
  const { setIdeas, setTotal } = useActions({
    setIdeas: createSetIdeas,
    setTotal: createSetTotal,
  });

  const { fetchIdeas, fetchMoreIdeas } = useThunkActions({
    fetchIdeas: createFetchIdeas,
    fetchMoreIdeas: createFetchMoreIdeas,
  });

  const rowCount = total;

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

  const user = useSignedInUser();

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
    setTotal({ total: initialIdeasState.total });

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

            return indexRange.startIndex === 0
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
                  rowHeight={ideaListItemFullHeight}
                  rowRenderer={({ key, index, style }) => {
                    const idea = ideas[index];

                    return (
                      <Box key={key} style={style}>
                        {!idea ? null : idea === 'loading' ? (
                          <IdeaOptionsSkeleton />
                        ) : idea instanceof Error ? (
                          <Box
                            display="flex"
                            alignItems="center"
                            height="100%"
                            mx={2}
                          >
                            <Typography
                              style={{
                                textDecoration: 'underline',
                                cursor: 'pointer',
                              }}
                              onClick={() => {
                                const fetchOptions = {
                                  startIndex: idea.startIndex,
                                  stopIndex: idea.stopIndex,
                                  fieldPath: idea.fieldPath,
                                  opStr: idea.opStr,
                                  value: idea.value,
                                };
                                if (idea.startIndex === 0) {
                                  fetchIdeas(fetchOptions);
                                } else {
                                  fetchMoreIdeas(fetchOptions);
                                }
                              }}
                            >
                              Refetch ideas
                            </Typography>
                            &nbsp; from {idea.startIndex + 1} to{' '}
                            {idea.stopIndex + 1}
                          </Box>
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
  return { ideas: selectIdeas(state), total: selectTotal(state) };
})(IdeasComponent);
