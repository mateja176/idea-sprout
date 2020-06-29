import { Box } from '@material-ui/core';
import { CollapseIconSkeleton } from 'components';
import { IdeaRow } from 'containers';
import { IdeaFilter, IdeaModel, User } from 'models';
import React from 'react';
import { useSelector } from 'react-redux';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';
import {
  createFetchIdeas,
  createFetchMoreIdeas,
  selectIdeas,
  useSignedInUser,
  useThunkActions,
} from 'services';
import { ideaListItemHeight, pageMargin } from 'styles';
import { getIsAuthor } from 'utils';
import { IdeaOptionsSkeleton } from '../IdeaOptionsSkeleton';

export interface IdeasProps<Key extends keyof IdeaModel> {
  filter: (user: User) => IdeaFilter<Key>;
}

export const Ideas = <Key extends keyof IdeaModel>({
  filter,
}: IdeasProps<Key>) => {
  const user = useSignedInUser();

  const filterOptions = React.useMemo(() => filter(user), [filter, user]);

  const { fetchIdeas, fetchMoreIdeas } = useThunkActions({
    fetchIdeas: createFetchIdeas,
    fetchMoreIdeas: createFetchMoreIdeas,
  });

  const ideas = useSelector(selectIdeas);

  const [rowCount, setRowCount] = React.useState(1000);

  React.useEffect(() => {
    if (ideas.includes(undefined)) {
      setRowCount(ideas.filter(Boolean).length);
    }
  }, [ideas]);

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

  return (
    <Box mt={pageMargin}>
      <div ref={listWrapperRef} style={{ height: listWrapperHeight }}>
        <InfiniteLoader
          loadMoreRows={(indexRange) => {
            const fetchOptions = { ...filterOptions, ...indexRange };

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
                          <IdeaRow
                            key={idea.id}
                            idea={idea}
                            isAuthor={getIsAuthor(user)(idea)}
                          />
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
