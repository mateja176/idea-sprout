import Box from '@material-ui/core/Box';
import { Location } from 'history';
import React from 'react';

export const NotFound: React.FC<Location> = () => (
  <Box mt={4} display="flex" justifyContent="center">
    Not Found
  </Box>
);
