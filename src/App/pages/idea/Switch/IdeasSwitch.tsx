import { absolutePrivateRoute, ideaPath } from 'elements/routes';
import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import LazyIdeaPage from '../Idea/LazyIdeaPage';
import LazyIdeasPage from '../Ideas/LazyIdeasPage';

export interface IdeasSwitchProps extends RouteComponentProps {}

const IdeasSwitch: React.FC<IdeasSwitchProps> = () => (
  <Switch>
    <Route
      exact
      path={absolutePrivateRoute.ideas.path}
      component={LazyIdeasPage}
    />
    <Route exact path={ideaPath} component={LazyIdeaPage} />
  </Switch>
);

export default IdeasSwitch;
