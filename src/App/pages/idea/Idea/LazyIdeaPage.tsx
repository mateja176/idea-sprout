import { IdeaContainerSkeleton } from 'containers/Idea/IdeaContainerSkeleton';
import { WithFallback } from 'models/components';
import React from 'react';

const LazyIdeaPage = React.lazy(() =>
  import(/* webpackChunkName: "IdeaPage" */ './IdeaPage'),
);
export default LazyIdeaPage;

export const LazyIdeaPageSuspender: React.FC<
  React.ComponentProps<typeof LazyIdeaPage> & WithFallback
> = ({ fallback = <IdeaContainerSkeleton />, ...props }) => (
  <React.Suspense fallback={fallback}>
    <LazyIdeaPage {...props} />
  </React.Suspense>
);
