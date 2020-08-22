import Box, { BoxProps } from '@material-ui/core/Box';
import React from 'react';
import { pageMargin } from '../utils/styles/styles';

export const PageWrapper: React.FC<BoxProps> = ({ children, ...props }) => (
  <Box m={pageMargin} {...props}>
    {children}
  </Box>
);
