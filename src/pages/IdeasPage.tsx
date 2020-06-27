import { Box } from '@material-ui/core';
import { Loading } from 'components';
import { Ideas } from 'containers';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export interface IdeasPageProps extends RouteComponentProps {}

export const IdeasPage: React.FC<IdeasPageProps> = () => {
  return (
    <Box>
      <React.Suspense fallback={<Loading />}>
        <Ideas
          filter={() => ({ fieldPath: 'status', opStr: '==', value: 'sprout' })}
        />
      </React.Suspense>
    </Box>
  );
};
