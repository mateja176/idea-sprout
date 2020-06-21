import {
  Box,
  CircularProgress,
  CircularProgressProps,
} from '@material-ui/core';
import React from 'react';

export interface LoadingProps extends CircularProgressProps {}

export const Loading: React.FC<LoadingProps> = (props) => (
  <Box m={3} display="flex" justifyContent="center">
    <CircularProgress {...props} />
  </Box>
);
