import { Box, Tab, Tabs } from '@material-ui/core';
import { Load } from 'components';
import React from 'react';
import { ideaMarginBottom } from 'styles';
import { IdeaOptionsSkeleton } from './IdeaOptionsSkeleton';
import { IdeaSkeleton } from './IdeaSkeleton';

export interface IdeaContainerSkeletonProps {}

export const IdeaContainerSkeleton: React.FC<IdeaContainerSkeletonProps> = () => (
  <Box mb={ideaMarginBottom}>
    <Load boxWidth={'100%'}>
      <Tabs value={false} variant={'fullWidth'}>
        <Tab />
        <Tab />
      </Tabs>
    </Load>
    <IdeaOptionsSkeleton />
    <IdeaSkeleton />
  </Box>
);
