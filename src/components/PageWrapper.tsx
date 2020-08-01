import { Box, BoxProps } from '@material-ui/core';
import React from 'react';
import { pageMargin } from 'styles';

export const PageWrapper: React.FC<BoxProps> = ({ children, ...props }) => (
  <Box m={pageMargin} {...props}>
    {children}
  </Box>
);
