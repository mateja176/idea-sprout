import { Box } from '@material-ui/core';
import { Ideas } from 'containers';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export interface IdeasPageProps extends RouteComponentProps {}

export const IdeasPage: React.FC<IdeasPageProps> = () => {
  return (
    <Box>
      <Ideas />
    </Box>
  );
};
