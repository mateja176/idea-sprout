import { Box } from '@material-ui/core';
import { Loading } from 'components';
import { Ideas } from 'containers';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { pageMargin } from 'styles';

export interface IdeasPageProps extends RouteComponentProps {}

export const IdeasPage: React.FC<IdeasPageProps> = () => (
  <Box mt={pageMargin}>
    <React.Suspense fallback={<Loading />}>
      <Ideas />
    </React.Suspense>
  </Box>
);
