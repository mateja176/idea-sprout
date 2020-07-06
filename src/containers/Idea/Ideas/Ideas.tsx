import { Box, Typography } from '@material-ui/core';
import { IdeaRow, IdeasSkeleton } from 'containers';
import { IdeaFilter, User } from 'models';
import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';
import {
  createPromisedAction,
  fetchIdeasAsync,
  IdeasState,
  selectCount,
  selectIdeas,
  State,
  useActions,
} from 'services';
import { ideaListItemFullHeight } from 'styles';
import { getType } from 'typesafe-actions';
import { IdeaOptionsSkeleton } from '../IdeaOptionsSkeleton';

export interface IdeasProps extends Pick<IdeasState, 'ideas' | 'count'> {
  user: User;
}

const publishedFilter: IdeaFilter<'status'> = {
  fieldPath: 'status',
  opStr: '==',
  value: 'sprout',
};

export const IdeasComponent = React.forwardRef<InfiniteLoader, IdeasProps>(
  ({ user, ideas, count }, infiniteLoaderRef) => {
    const rowCount = count;

    const dispatch = useDispatch();

    const { fetchIdeas } = useActions({
      fetchIdeas: fetchIdeasAsync.request,
    });

    return (
      <InfiniteLoader
        ref={infiniteLoaderRef}
        loadMoreRows={(indexRange) => {
          const fetchOptions = { ...publishedFilter, ...indexRange };

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
                  <Box>
                    <IdeasSkeleton />
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
    );
  },
);

export const Ideas = connect(
  (state: State) => {
    // * useSelector was returning "[]" instead of "['loading', 'loading', 'loading'...]"
    // * hence the loading state was not being rendered between filter updates
    return { ideas: selectIdeas(state), count: selectCount(state) };
  },
  null,
  null,
  { forwardRef: true },
)(IdeasComponent);
