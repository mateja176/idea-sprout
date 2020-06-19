import { PageWrapper } from 'components';
import { Ideas } from 'containers';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export interface DiscoverProps extends RouteComponentProps {}

export const Discover: React.FC<DiscoverProps> = () => (
  <PageWrapper>
    <Ideas />
  </PageWrapper>
);
