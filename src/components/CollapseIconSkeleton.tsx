import { Hidden, Icon } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React from 'react';

export interface CollapseIconSkeletonProps {}

export const CollapseIconSkeleton: React.FC<CollapseIconSkeletonProps> = () => (
  <Hidden xsDown>
    <Icon>
      <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
    </Icon>
  </Hidden>
);
