import { absolutePrivateRoute, ideaPath } from 'elements/routes';
import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { LazyIdeaPageSuspender } from './LazyIdeaPage';
import { LazyIdeasPageSuspender } from './LazyIdeasPage';

export interface IdeasSwitchProps extends RouteComponentProps {}

const IdeasSwitch: React.FC<IdeasSwitchProps> = () => (
  <Switch>
    <Route
      exact
      path={absolutePrivateRoute.ideas.path}
      component={LazyIdeasPageSuspender}
    />
    <Route exact path={ideaPath} component={LazyIdeaPageSuspender} />
  </Switch>
);

export default IdeasSwitch;
