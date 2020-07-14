import { Box } from '@material-ui/core';
import { Skeleton, SkeletonProps } from '@material-ui/lab';
import React from 'react';

export interface LoaderProps extends SkeletonProps {
  boxWidth?: React.CSSProperties['width'];
}

export const Load: React.FC<LoaderProps> = ({
  boxWidth,
  children,
  ...props
}) => (
  <Box position="relative" display={'inline-block'} width={boxWidth}>
    <Skeleton
      variant="rect"
      width={'100%'}
      height={'100%'}
      {...props}
      style={{ position: 'absolute', ...props.style }}
    />
    <Box visibility={'hidden'}>{children}</Box>
  </Box>
);
