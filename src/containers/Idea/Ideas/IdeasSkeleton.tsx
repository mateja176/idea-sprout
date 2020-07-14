import { Box, List } from '@material-ui/core';
import { range } from 'ramda';
import React from 'react';
import { AutoSizer } from 'react-virtualized';
import { ideaListStyle } from 'styles';
import { ideasFetchLimit } from 'utils';
import { IdeaOptionsSkeleton } from '../IdeaOptionsSkeleton';

export interface IdeasSkeletonProps {}

export const IdeasSkeleton: React.FC<IdeasSkeletonProps> = () => {
  return (
    <AutoSizer>
      {(size) => (
        <Box {...size} overflow={'auto'}>
          <List style={ideaListStyle}>
            {range(0, ideasFetchLimit).map((i) => (
              <IdeaOptionsSkeleton key={i} />
            ))}
          </List>
        </Box>
      )}
    </AutoSizer>
  );
};
