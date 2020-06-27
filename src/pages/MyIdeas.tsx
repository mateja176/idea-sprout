import { Box } from '@material-ui/core';
import { Loading } from 'components';
import { Ideas } from 'containers';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export interface MyIdeasProps extends RouteComponentProps {}

export const MyIdeas: React.FC<MyIdeasProps> = () => (
  <Box>
    <React.Suspense fallback={<Loading />}>
      <Ideas
        filter={(user) => ({
          fieldPath: 'author',
          opStr: '==',
          value: user.email,
        })}
      />
    </React.Suspense>
  </Box>
);
