/// <reference types="webpack-env" />

import Loader from 'react-loadable';
import { SigninSkeleton } from './SigninSkeleton';

export const loadSignin = () =>
  import(/* webpackChunkName: "Signin" */ './SigninSuspender');

const modules = ['./Signin.tsx'];

const webpack = () => [require.resolveWeak('./Signin.tsx')];

const LazySignin = Loader({
  loader: loadSignin,
  loading: SigninSkeleton,
  modules,
  webpack,
});
export default LazySignin;
