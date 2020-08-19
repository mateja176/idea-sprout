import { WithFallback } from 'models/components';
import React from 'react';
import { SigninSkeleton } from './SigninSkeleton';

const LazySignin = React.lazy(() =>
  import(/* webpackChunkName: "Signin" */ './Signin'),
);
export default LazySignin;

export const LazySigninSuspender: React.FC<
  React.ComponentProps<typeof LazySignin> & WithFallback
> = ({ fallback = <SigninSkeleton />, ...props }) => (
  <React.Suspense fallback={fallback}>
    <LazySignin {...props} />
  </React.Suspense>
);
