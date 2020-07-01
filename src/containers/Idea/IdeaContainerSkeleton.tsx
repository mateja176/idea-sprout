import { Box } from '@material-ui/core';
import { IdeaOptionsWrapper } from 'components';
import React from 'react';
import { ideaMarginBottom, pageMargin } from 'styles';
import { IdeaOptionsSkeleton } from './IdeaOptionsSkeleton';
import { IdeaSkeleton } from './IdeaSkeleton';

export interface IdeaContainerSkeletonProps {}

export const IdeaContainerSkeleton: React.FC<IdeaContainerSkeletonProps> = () => (
  <Box mt={pageMargin} mb={ideaMarginBottom}>
    <IdeaOptionsWrapper>
      <IdeaOptionsSkeleton />
    </IdeaOptionsWrapper>
    <IdeaSkeleton />
  </Box>
);
