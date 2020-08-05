import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import range from 'ramda/es/range';
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
