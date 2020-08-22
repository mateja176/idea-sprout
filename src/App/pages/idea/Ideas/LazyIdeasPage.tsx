import Loadable from 'react-loadable';
import IdeasPageSkeleton from './IdeasPageSkeleton';

const LazyIdeasPage = Loadable({
  loader: () => import(/* webpackChunkName: "IdeasPage" */ './IdeasPage'),
  loading: IdeasPageSkeleton,
  modules: ['./IdeasPage.tsx'],
  webpack: () => [require.resolveWeak('./IdeasPage.tsx')],
});

export default LazyIdeasPage;
