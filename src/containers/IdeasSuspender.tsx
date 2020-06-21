import { Box } from '@material-ui/core';
import React, { Suspense } from 'react';
import { IdeasContainer } from './Ideas';

export interface IdeasProps {}

export const Ideas: React.FC<IdeasProps> = () => {
  return (
    <Suspense fallback={<Box>Loading...</Box>}>
      <IdeasContainer />
    </Suspense>
  );
};
