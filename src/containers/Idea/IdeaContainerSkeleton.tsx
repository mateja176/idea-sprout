import { Box, Tab, Tabs } from '@material-ui/core';
import { Load } from 'components';
import React from 'react';
import { BackToIdeas } from './BackToIdeas';
import { IdeaSkeleton } from './IdeaSkeleton';

export interface IdeaContainerSkeletonProps {}

export const IdeaContainerSkeleton: React.FC<IdeaContainerSkeletonProps> = () => {
  return (
    <>
      <Tabs value={false}>
        <BackToIdeas />
        <Load boxFlex={1}>
          <Tab />
        </Load>
      </Tabs>
      <Box flex={1} display={'flex'} flexDirection={'column'} overflow={'auto'}>
        <IdeaSkeleton />
      </Box>
    </>
  );
};
