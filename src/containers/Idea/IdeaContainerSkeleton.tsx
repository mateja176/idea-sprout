import { Box } from '@material-ui/core';
import React from 'react';
import { ideaMarginBottom, pageMargin } from 'styles';
import { IdeaOptionsSkeleton } from './IdeaOptionsSkeleton';
import { IdeaSkeleton } from './IdeaSkeleton';

export interface IdeaContainerSkeletonProps {}

export const IdeaContainerSkeleton: React.FC<IdeaContainerSkeletonProps> = () => (
  <Box mt={pageMargin} mb={ideaMarginBottom}>
    <IdeaOptionsSkeleton />
    <IdeaSkeleton />
  </Box>
);
