import { Box } from '@material-ui/core';
import { IdeasSuspender } from 'containers';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { pageMargin } from 'styles';

export interface MyIdeasProps extends RouteComponentProps {}

export const MyIdeas: React.FC<MyIdeasProps> = () => (
  // TODO pass filter prop to Ideas component when it is implemented
  <Box mt={pageMargin}>
    <IdeasSuspender />
  </Box>
);
