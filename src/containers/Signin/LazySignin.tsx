/// <reference types="webpack-env" />

import Loadable from 'react-loadable';
import SigninSkeleton from './SigninSkeleton';

export const loadSignin = () =>
  import(/* webpackChunkName: "SigninSuspender" */ './SigninSuspender');

const modules = ['./SigninSuspender'];

const webpack = () => [require.resolveWeak('./SigninSuspender')];

const LazySignin = Loadable({
  loader: loadSignin,
  loading: SigninSkeleton,
  modules,
  webpack,
});

export default LazySignin;
