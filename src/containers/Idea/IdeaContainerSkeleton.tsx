import { Box, Tab, Tabs } from '@material-ui/core';
import { Load } from 'components';
import React from 'react';
import { ideaMarginBottom } from 'styles';
import { BackToIdeas } from './BackToIdeas';
import { IdeaOptionsSkeleton } from './IdeaOptionsSkeleton';
import { IdeaSkeleton } from './IdeaSkeleton';

export interface IdeaContainerSkeletonProps {}

export const IdeaContainerSkeleton: React.FC<IdeaContainerSkeletonProps> = () => (
  <Box mb={ideaMarginBottom}>
    <Tabs value={false} variant={'fullWidth'}>
      <BackToIdeas />
      <Load boxFlex={1}>
        <Tab />
      </Load>
    </Tabs>
    <IdeaOptionsSkeleton />
    <IdeaSkeleton />
  </Box>
);
