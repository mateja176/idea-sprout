import { Box, BoxProps } from '@material-ui/core';
import React from 'react';

export const ReviewSection: React.FC<BoxProps> = (props) => (
  <Box display={'grid'} gridGap={15} my={3} mx={2} {...props} />
);
