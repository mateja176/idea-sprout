import { Box } from '@material-ui/core';
import { Ideas, IdeasSkeleton } from 'containers';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { pageMargin } from 'styles';

export interface IdeasPageProps extends RouteComponentProps {}

export const IdeasPage: React.FC<IdeasPageProps> = () => {
  return (
    <Box mt={pageMargin}>
      <React.Suspense fallback={<IdeasSkeleton />}>
        <Ideas
          filter={() => ({ fieldPath: 'status', opStr: '==', value: 'sprout' })}
        />
      </React.Suspense>
    </Box>
  );
};
