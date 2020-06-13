import { PageWrapper } from 'components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export interface IdeasProps extends RouteComponentProps {}

export const Ideas: React.FC<IdeasProps> = () => (
  <PageWrapper>List of ideas</PageWrapper>
);
