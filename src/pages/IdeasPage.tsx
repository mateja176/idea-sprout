import { IdeasSuspender } from 'containers';
import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import urljoin from 'url-join';
import { absolutePrivateRoute } from 'utils';
import { CreateIdea } from './CreateForm';
import { EditIdea } from './EditIdea';
import { IdeaPage } from './IdeaPage';

export interface IdeasPageProps extends RouteComponentProps {}

export const IdeasPage: React.FC<IdeasPageProps> = () => (
  <Switch>
    <Route
      exact
      path={absolutePrivateRoute.ideas.path}
      component={IdeasSuspender}
    />
    <Route
      path={absolutePrivateRoute.ideas.children.my.path}
      component={IdeasSuspender}
    />
    <Route
      path={absolutePrivateRoute.ideas.children.create.path}
      component={CreateIdea}
    />
    <Route
      path={urljoin(absolutePrivateRoute.ideas.children.edit.path, ':id')}
      component={EditIdea}
    />
    <Route
      exact
      path={urljoin(absolutePrivateRoute.ideas.path, ':id')}
      component={IdeaPage}
    />
  </Switch>
);
