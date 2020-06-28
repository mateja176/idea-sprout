import { Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { IdeaSection } from 'components';
import React from 'react';

export interface IdeaSkeletonProps {}

export const IdeaSkeleton: React.FC<IdeaSkeletonProps> = () => (
  <Box>
    <Skeleton variant="rect" width={'100%'} height={720} />
    <IdeaSection>
      <Skeleton width={170} height={'3em'} />
      <Skeleton width={'100%'} />
      <Skeleton width={'100%'} />
      <Skeleton width={'100%'} />
    </IdeaSection>
    <Skeleton variant="rect" width={'100%'} height={720} />
    <IdeaSection>
      <Skeleton width={170} height={'3em'} />
      <Skeleton width={'100%'} />
      <Skeleton width={'100%'} />
      <Skeleton width={'100%'} />
      <Skeleton width={'100%'} />
    </IdeaSection>
  </Box>
);
