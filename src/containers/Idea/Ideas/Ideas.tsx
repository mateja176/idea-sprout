import { Box, Typography } from '@material-ui/core';
import { IdeaRow, IdeasSkeleton } from 'containers';
import { IdeaFilter, User, WithCount } from 'models';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';
import { useFirestoreDocData } from 'reactfire';
import {
  createPromisedAction,
  fetchIdeasAsync,
  selectIdeas,
  useActions,
  useIdeasCountRef,
} from 'services';
import { ideaListItemFullHeight } from 'styles';
import { getType } from 'typesafe-actions';
import { IdeaOptionsSkeleton } from '../IdeaOptionsSkeleton';

export interface IdeasProps {
  user: User;
}

const publishedFilter: IdeaFilter<'status'> = {
  fieldPath: 'status',
  opStr: '==',
  value: 'sprout',
};

export const Ideas = ({ user }: IdeasProps) => {
  const ideas = useSelector(selectIdeas);

  const ideasCountRef = useIdeasCountRef();

  const { count: rowCount = 1000 } = useFirestoreDocData<WithCount>(
    ideasCountRef,
  );

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
};
