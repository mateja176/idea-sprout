import { Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { IdeaSection, Load } from 'components';
import { problemSolutionTitle, rationaleTitle } from 'elements';
import React from 'react';

export interface IdeaSkeletonProps {}

export const IdeaSkeleton: React.FC<IdeaSkeletonProps> = () => (
  <Box>
    <Skeleton variant="rect" width={'100%'} height={720} />
    <IdeaSection>
      <Load>{problemSolutionTitle}</Load>
      <Skeleton width={'100%'} />
      <Skeleton width={'100%'} />
      <Skeleton width={'100%'} />
    </IdeaSection>
    <Skeleton variant="rect" width={'100%'} height={720} />
    <IdeaSection>
      <Load>{rationaleTitle}</Load>
      <Skeleton width={'100%'} />
      <Skeleton width={'100%'} />
      <Skeleton width={'100%'} />
      <Skeleton width={'100%'} />
    </IdeaSection>
  </Box>
);
