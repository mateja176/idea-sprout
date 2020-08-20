/// <reference types="webpack-env" />

import Loadable from 'react-loadable';
import { SigninSkeleton } from './SigninSkeleton';

export const loadSignin = () =>
  import(/* webpackChunkName: "Signin" */ './SigninSuspender');

const modules = ['./Signin.tsx'];

const webpack = () => [require.resolveWeak('./Signin.tsx')];

const LazySignin = Loadable({
  loader: loadSignin,
  loading: SigninSkeleton,
  modules,
  webpack,
});
export default LazySignin;
