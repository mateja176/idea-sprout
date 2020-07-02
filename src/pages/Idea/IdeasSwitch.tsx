import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import urljoin from 'url-join';
import { absolutePrivateRoute } from 'utils';
import { IdeaPage } from './IdeaPage';
import { IdeasPage } from './IdeasPage';

export interface IdeasSwitchProps extends RouteComponentProps {}

export const IdeasSwitch: React.FC<IdeasSwitchProps> = () => (
  <Switch>
    <Route exact path={absolutePrivateRoute.ideas.path} component={IdeasPage} />
    <Route
      exact
      path={urljoin(absolutePrivateRoute.ideas.path, ':id')}
      component={IdeaPage}
    />
  </Switch>
);
