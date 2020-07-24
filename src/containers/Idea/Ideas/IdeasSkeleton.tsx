import { Box, List } from '@material-ui/core';
import { range } from 'ramda';
import React from 'react';
import { ideaListStyle } from 'styles';
import { ideasFetchLimit } from 'utils';
import { IdeaOptionsSkeleton } from '../IdeaOptionsSkeleton';

export interface IdeasSkeletonProps {}

export const IdeasSkeleton: React.FC<IdeasSkeletonProps> = () => {
  return (
    <Box flex={1} display={'flex'} flexDirection={'column'} overflow={'auto'}>
      <List style={ideaListStyle}>
        {range(0, ideasFetchLimit).map((i) => (
          <IdeaOptionsSkeleton key={i} />
        ))}
      </List>
    </Box>
  );
};
