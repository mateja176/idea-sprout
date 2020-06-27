import { Box } from '@material-ui/core';
import { Loading } from 'components';
import React from 'react';
import { pageMargin } from 'styles';
import { Ideas } from '.';

export interface IdeasSuspenderProps {}

export const IdeasSuspender: React.FC<IdeasSuspenderProps> = () => (
  <Box mt={pageMargin}>
    <React.Suspense fallback={<Loading />}>
      <Ideas />
    </React.Suspense>
  </Box>
);
