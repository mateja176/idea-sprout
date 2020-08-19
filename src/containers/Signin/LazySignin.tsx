/// <reference types="webpack-env" />

import Box from '@material-ui/core/Box';
import React from 'react';
import Loader from 'react-loadable';
import { SigninSkeleton } from './SigninSkeleton';

export const loadSignin = () =>
  import(/* webpackChunkName: "Signin" */ './Signin');

const modules = ['./Signin.tsx'];

const webpack = () => [require.resolveWeak('./Signin.tsx')];

const LazySignin = Loader({
  loader: loadSignin,
  loading: SigninSkeleton,
  modules,
  webpack,
});
export default LazySignin;

const CenteredSigninSkeleton = () => (
  <Box
    display={'flex'}
    alignItems={'center'}
    justifyContent={'center'}
    height={'100%'}
  >
    <SigninSkeleton />
  </Box>
);

export const CenteredLazySignin = Loader({
  loader: loadSignin,
  loading: CenteredSigninSkeleton,
  modules,
  webpack,
});
