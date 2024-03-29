import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { IdeaContainerSkeleton } from '../../../../containers/Idea/IdeaContainerSkeleton';
import { absolutePrivateRoute, ideaPath } from '../../../../elements/routes';
import IdeasPageSkeleton from '../Ideas/IdeasPageSkeleton';

export const IdeasSwitchSkeleton: React.FC = () => (
  <Switch>
    <Route
      exact
      path={absolutePrivateRoute.ideas.path}
      component={IdeasPageSkeleton}
    />
    <Route exact path={'/'} component={IdeasPageSkeleton} />
    <Route exact path={ideaPath} component={IdeaContainerSkeleton} />
  </Switch>
);
