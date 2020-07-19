import { Box, Tab, Tabs, useTheme } from '@material-ui/core';
import { Load } from 'components';
import React from 'react';
import { ideaTabsShadowVariant } from 'styles';
import { BackToIdeas } from './BackToIdeas';
import { IdeaSkeleton } from './IdeaSkeleton';

export interface IdeaContainerSkeletonProps {}

export const IdeaContainerSkeleton: React.FC<IdeaContainerSkeletonProps> = () => {
  const theme = useTheme();

  return (
    <Box>
      <Tabs
        value={false}
        style={{ boxShadow: theme.shadows[ideaTabsShadowVariant] }}
      >
        <BackToIdeas />
        <Load boxFlex={1}>
          <Tab />
        </Load>
      </Tabs>
      <Box flex={1} display={'flex'} flexDirection={'column'} overflow={'auto'}>
        <IdeaSkeleton />
      </Box>
    </Box>
  );
};
