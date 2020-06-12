import { Box } from '@material-ui/core';
import React from 'react';

export interface PageWrapperProps {}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => (
  <Box m={3}>{children}</Box>
);
