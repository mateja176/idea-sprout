import { Box } from '@material-ui/core';
import { IdeasSuspender } from 'containers';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { pageMargin } from 'styles';

export interface IdeasProps extends RouteComponentProps {}

export const Ideas: React.FC<IdeasProps> = () => (
  <Box mt={pageMargin}>
    <IdeasSuspender />
  </Box>
);
