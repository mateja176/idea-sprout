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

const linkButtonStyle: React.CSSProperties = {
  textDecoration: 'underline',
  cursor: 'pointer',
};

const actionCreators = {
  fetchIdeas: fetchIdeasAsync.request,
};

const NoRowsRenderer = () => (
  <Box>
    <IdeasSkeleton />
  </Box>
);

export const Ideas = ({ user }: IdeasProps) => {
  const ideas = useSelector(selectIdeas);

  const ideasCountRef = useIdeasCountRef();

  const { count: rowCount = 1000 } = useFirestoreDocData<WithCount>(
    ideasCountRef,
  );

  const dispatch = useDispatch();

  const { fetchIdeas } = useActions(actionCreators);

  const loadMoreRows = React.useCallback(
    ({ startIndex, stopIndex }) => {
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
    },
    [dispatch, fetchIdeas],
  );

  const isRowLoaded = React.useCallback(
    ({ index }) => {
      return !!ideas[index];
    },
    [ideas],
  );

  const RowRenderer = React.useCallback(
    ({ key, index, style }) => {
      const idea = ideas[index];

      return (
        <Box key={key} style={style}>
          {!idea ? null : idea === 'loading' ? (
            <IdeaOptionsSkeleton />
          ) : idea instanceof Error ? (
            <Box display="flex" alignItems="center" height="100%" mx={2}>
              <Typography
                style={linkButtonStyle}
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
              &nbsp; from {idea.startIndex + 1} to {idea.stopIndex + 1}
            </Box>
          ) : (
            <IdeaRow
              key={idea.id}
              idea={idea}
              uid={user.uid}
            />
          )}
        </Box>
      );
    },
    [fetchIdeas, ideas, user],
  );

  return (
    <InfiniteLoader
      loadMoreRows={loadMoreRows}
      isRowLoaded={isRowLoaded}
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
              noRowsRenderer={NoRowsRenderer}
              rowRenderer={RowRenderer}
            />
          )}
        </AutoSizer>
      )}
    </InfiniteLoader>
  );
};
