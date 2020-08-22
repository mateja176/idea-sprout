import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import { range } from 'ramda';
import React from 'react';
import { ideasFetchLimit } from '../../../utils/idea/idea';
import { ideaListStyle } from '../../../utils/styles/idea';
import { IdeaOptionsSkeleton } from '../Options/IdeaOptionsSkeleton';

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
