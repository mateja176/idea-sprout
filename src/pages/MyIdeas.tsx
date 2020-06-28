import { Box } from '@material-ui/core';
import { Ideas, IdeasSkeleton } from 'containers';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { pageMargin } from 'styles';

export interface MyIdeasProps extends RouteComponentProps {}

export const MyIdeas: React.FC<MyIdeasProps> = () => (
  <Box mt={pageMargin}>
    <React.Suspense fallback={<IdeasSkeleton />}>
      <Ideas
        filter={(user) => ({
          fieldPath: 'author',
          opStr: '==',
          value: user.email || '',
        })}
      />
    </React.Suspense>
  </Box>
);
