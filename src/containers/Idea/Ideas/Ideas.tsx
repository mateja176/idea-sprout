import { Box, Tab, Tabs, Typography } from '@material-ui/core';
import { CreateIdea, IdeaRow } from 'containers';
import { IdeaFilter } from 'models';
import qs from 'qs';
import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';
import {
  createPromisedAction,
  createSetIdeas,
  createSetTotal,
  fetchIdeasAsync,
  IdeasState,
  initialIdeasState,
  selectIdeas,
  selectTotal,
  State,
  useActions,
  useSignedInUser,
} from 'services';
import { ideaListItemFullHeight } from 'styles';
import { getType } from 'typesafe-actions';
import { IdeaOptionsSkeleton } from '../IdeaOptionsSkeleton';

export interface IdeasProps extends Pick<IdeasState, 'ideas' | 'total'> {}

export const IdeasComponent: React.FC<IdeasProps> = ({ ideas, total }) => {
  const dispatch = useDispatch();

  const { fetchIdeas, setIdeas, setTotal } = useActions({
    fetchIdeas: fetchIdeasAsync.request,
    setIdeas: createSetIdeas,
    setTotal: createSetTotal,
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

            fetchIdeas(fetchOptions);

            return new Promise((resolve) => {
              dispatch(
                createPromisedAction({
                  type: getType(fetchIdeasAsync.success),
                  callback: resolve,
                }),
              );
            });
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
                  noRowsRenderer={() => (
                    <Box m={3}>
                      <Typography variant="h6">
                        I have no idea{' '}
                        <span role="img" aria-label="thinking">
                          🤔
                        </span>
                      </Typography>
                      <Box
                        mt={2}
                        visibility={showMyIdeas ? 'visible' : 'hidden'}
                      >
                        <CreateIdea user={user} />
                      </Box>
                    </Box>
                  )}
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
                                fetchIdeas(fetchOptions);
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
