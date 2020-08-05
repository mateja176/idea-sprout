import Box from '@material-ui/core/Box';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export const NotFound: React.FC<RouteComponentProps> = () => (
  <Box mt={4} display="flex" justifyContent="center">
    Not Found
  </Box>
);
