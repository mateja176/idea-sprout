import Loadable from 'react-loadable';
import { IdeaContainerSkeleton } from '../../../../containers/Idea/IdeaContainerSkeleton';

const LazyIdeaPage = Loadable({
  loader: () => import(/* webpackChunkName: "IdeaPage" */ './IdeaPage'),
  loading: IdeaContainerSkeleton,
  modules: ['./IdeaPage'],
  webpack: () => [require.resolveWeak('./IdeaPage')],
});
export default LazyIdeaPage;
