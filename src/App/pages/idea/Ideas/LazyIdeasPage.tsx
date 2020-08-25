import Loadable from 'react-loadable';
import IdeasPageSkeleton from './IdeasPageSkeleton';

const LazyIdeasPage = Loadable({
  loader: () => import(/* webpackChunkName: "IdeasPage" */ './IdeasPage'),
  loading: IdeasPageSkeleton,
  modules: ['./IdeasPage'],
  webpack: () => [require.resolveWeak('./IdeasPage')],
});

export default LazyIdeasPage;
