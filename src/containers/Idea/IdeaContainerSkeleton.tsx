import { Box, Tab, Tabs } from '@material-ui/core';
import React from 'react';
import { ideaMarginBottom } from 'styles';
import { BackToIdeas } from './BackToIdeas';
import { IdeaOptionsSkeleton } from './IdeaOptionsSkeleton';
import { IdeaSkeleton } from './IdeaSkeleton';

export interface IdeaContainerSkeletonProps {}

export const IdeaContainerSkeleton: React.FC<IdeaContainerSkeletonProps> = () => (
  <>
    <Tabs value={false} variant={'fullWidth'}>
      <BackToIdeas />
      <Tab />
    </Tabs>
    <IdeaOptionsSkeleton />
    <Box
      flex={1}
      display={'flex'}
      flexDirection={'column'}
      overflow={'auto'}
      mb={ideaMarginBottom}
    >
      <IdeaSkeleton />
    </Box>
  </>
);
