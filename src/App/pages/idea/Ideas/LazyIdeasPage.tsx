import { WithFallback } from 'models/components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { IdeasPageSkeleton } from './IdeasPageSkeleton';

const LazyIdeasPage = React.lazy(() =>
  import(/* webpackChunkName: "IdeasPage" */ './IdeasPage'),
);
export default LazyIdeasPage;

export const LazyIdeasPageSuspender: React.FC<
  RouteComponentProps & WithFallback
> = ({ fallback = <IdeasPageSkeleton />, ...props }) => (
  <React.Suspense fallback={fallback}>
    <LazyIdeasPage {...props} />
  </React.Suspense>
);
