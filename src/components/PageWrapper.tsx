import { Box } from '@material-ui/core';
import React from 'react';
import { pageMargin } from 'styles';

export interface PageWrapperProps {}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => (
  <Box m={pageMargin}>{children}</Box>
);
