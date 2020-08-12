import { IdeaContainerSkeleton } from 'containers/Idea/IdeaContainerSkeleton';
import { absolutePrivateRoute, ideaPath } from 'elements/routes';
import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { IdeaPageProps } from './IdeaPage';
import { IdeasPageSkeleton } from './IdeasPageSkeleton';

const LazyIdeasPage = React.lazy(() => import('./IdeasPage'));
const IdeasPage: React.FC<RouteComponentProps> = (props) => (
  <React.Suspense fallback={<IdeasPageSkeleton />}>
    <LazyIdeasPage {...props} />
  </React.Suspense>
);

const LazyIdeaPage = React.lazy(() => import('./IdeaPage'));
const IdeaPage: React.FC<IdeaPageProps> = (props) => (
  <React.Suspense fallback={<IdeaContainerSkeleton />}>
    <LazyIdeaPage {...props} />
  </React.Suspense>
);

export interface IdeasSwitchProps extends RouteComponentProps {}

const IdeasSwitch: React.FC<IdeasSwitchProps> = () => (
  <Switch>
    <Route exact path={absolutePrivateRoute.ideas.path} component={IdeasPage} />
    <Route exact path={ideaPath} component={IdeaPage} />
  </Switch>
);

export default IdeasSwitch;
