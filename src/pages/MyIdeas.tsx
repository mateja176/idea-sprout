import { PageWrapper } from 'components';
import { IdeasSuspender } from 'containers';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export interface MyIdeasProps extends RouteComponentProps {}

export const MyIdeas: React.FC<MyIdeasProps> = () => (
  // TODO pass filter prop to Ideas component when it is implemented
  <PageWrapper>
    <IdeasSuspender />
  </PageWrapper>
);
