import { PageWrapper } from 'components';
import { IdeasSuspender } from 'containers';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export interface IdeasProps extends RouteComponentProps {}

export const Ideas: React.FC<IdeasProps> = () => (
  <PageWrapper>
    <IdeasSuspender />
  </PageWrapper>
);
