import { Box, Typography } from '@material-ui/core';
import { IdeaRow, IdeasSkeleton } from 'containers';
import { IdeaFilter, User, WithCount } from 'models';
import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';
import { useFirestoreDocData } from 'reactfire';
import {
  createPromisedAction,
  fetchIdeasAsync,
  IdeasState,
  selectIdeas,
  State,
  useActions,
  useIdeasCountRef,
} from 'services';
import { ideaListItemFullHeight } from 'styles';
import { getType } from 'typesafe-actions';
import { IdeaOptionsSkeleton } from '../IdeaOptionsSkeleton';

export interface IdeasProps extends Pick<IdeasState, 'ideas'> {
  user: User;
}

const publishedFilter: IdeaFilter<'status'> = {
  fieldPath: 'status',
  opStr: '==',
  value: 'sprout',
};

export const IdeasComponent = ({ user, ideas }: IdeasProps) => {
  const ideasCountRef = useIdeasCountRef();

  const { count: rowCount } = useFirestoreDocData<WithCount>(ideasCountRef);

  const dispatch = useDispatch();

  const { fetchIdeas } = useActions({
    fetchIdeas: fetchIdeasAsync.request,
  });

  return (
    <InfiniteLoader
      loadMoreRows={({ startIndex, stopIndex }) => {
        const fetchOptions = {
          ...publishedFilter,
          startIndex,
          stopIndex: stopIndex + 1, // * since the index is inclusive
        };

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
          {({ width }) => (
            <List
              rowCount={rowCount}
              ref={registerChild}
              onRowsRendered={onRowsRendered}
              width={width}
              height={ideaListItemFullHeight * rowCount}
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
};
export const Ideas = connect((state: State) => {
  // * useSelector was returning "[]" instead of "['loading', 'loading', 'loading'...]"
  // * hence the loading state was not being rendered between filter updates
  return { ideas: selectIdeas(state) };
})(IdeasComponent);
