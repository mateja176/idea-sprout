import { Box } from '@material-ui/core';
import React, { Suspense } from 'react';
import { Ideas } from './Ideas';

export interface IdeasSuspenderProps {}

export const IdeasSuspender: React.FC<IdeasSuspenderProps> = () => {
  return (
    <Suspense fallback={<Box>Loading...</Box>}>
      <Ideas />
    </Suspense>
  );
};
