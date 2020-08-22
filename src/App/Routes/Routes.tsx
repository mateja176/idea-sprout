import React from 'react';
import { Route, Switch } from 'react-router-dom';
import RedirectToIdeas from '../../components/Idea/RedirectToIdeas';
import { NotFound } from '../../components/NotFound';
import { absolutePrivateRoute } from '../../elements/routes';
import IdeasSwitch from '../pages/idea/Switch/IdeasSwitch';

export const Routes: React.FC = () => {
  return (
    <Switch>
      <Route
        exact
        path={absolutePrivateRoute.root.path}
        component={RedirectToIdeas}
      />
      <Route path={absolutePrivateRoute.ideas.path} component={IdeasSwitch} />
      <Route component={NotFound} />
    </Switch>
  );
};
