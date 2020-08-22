import Loadable from 'react-loadable';
import { IdeaContainerSkeleton } from '../../../../containers/Idea/IdeaContainerSkeleton';

const LazyIdeaPage = Loadable({
  loader: () => import(/* webpackChunkName: "IdeaPage" */ './IdeaPage'),
  loading: IdeaContainerSkeleton,
  modules: ['./IdeaPage.tsx'],
  webpack: () => [require.resolveWeak('./IdeaPage.tsx')],
});
export default LazyIdeaPage;
