import { Loading } from 'components';
import React, { Suspense } from 'react';
import { Ideas } from './Ideas';

export interface IdeasSuspenderProps {}

export const IdeasSuspender: React.FC<IdeasSuspenderProps> = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Ideas />
    </Suspense>
  );
};
