import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { User } from 'firebase/app';
import { IdeaFilter } from 'models/firebase';
import { IdeaBatchError } from 'models/idea';
import { WithCount } from 'models/models';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AutoSizer } from 'react-virtualized/dist/commonjs/AutoSizer';
import { InfiniteLoader } from 'react-virtualized/dist/commonjs/InfiniteLoader';
import { List } from 'react-virtualized/dist/commonjs/List';
import { useFirestoreDocData } from 'reactfire';
import { useIdeasCountRef } from 'services/hooks/firebase';
import { useActions } from 'services/hooks/hooks';
import {
  createPromisedAction,
  fetchIdeasAsync,
  FetchIdeasAsync,
  selectIdeas,
} from 'services/store';
import { ideaListItemFullHeight } from 'styles/idea';
import { getType } from 'typesafe-actions';
import { IdeaRow } from '../IdeaRow';
import { IdeaOptionsSkeleton } from '../Options/IdeaOptionsSkeleton';
import { IdeasSkeleton } from './IdeasSkeleton';

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

const RowError: React.FC<{
  error: IdeaBatchError;
  fetchIdeas: FetchIdeasAsync['request'];
}> = ({ error, fetchIdeas }) => {
  const handleLinkClick: React.MouseEventHandler = React.useCallback(() => {
    const fetchOptions = {
      startIndex: error.startIndex,
      stopIndex: error.stopIndex,
      fieldPath: error.fieldPath,
      opStr: error.opStr,
      value: error.value,
    };
    fetchIdeas(fetchOptions);
  }, [error, fetchIdeas]);

  return (
    <Box display="flex" alignItems="center" height="100%" mx={2}>
      <Typography style={linkButtonStyle} onClick={handleLinkClick}>
        Refetch ideas
      </Typography>
      &nbsp; from {error.startIndex + 1} to {error.stopIndex + 1}
    </Box>
  );
};

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
            <RowError error={idea} fetchIdeas={fetchIdeas} />
          ) : (
            <IdeaRow key={idea.id} idea={idea} user={user} />
          )}
        </Box>
      );
    },
    [fetchIdeas, ideas, user],
  );

  return (
    <AutoSizer>
      {({ width, height }) => (
        <InfiniteLoader
          loadMoreRows={loadMoreRows}
          isRowLoaded={isRowLoaded}
          rowCount={rowCount}
        >
          {({ onRowsRendered, registerChild }) => (
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
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
};
