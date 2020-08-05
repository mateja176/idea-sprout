import { NotFound } from 'components';
import { WithUserState } from 'models';
import { IdeasSwitch, Signin } from 'pages';
import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { absolutePrivateRoute, isUserLoading } from 'utils';
import { RoutesSkeleton } from './RoutesSkeleton';

const RedirectToIdeas: React.FC<RouteComponentProps> = () => (
  <Redirect to={absolutePrivateRoute.ideas.path} />
);

export const Routes: React.FC<WithUserState> = ({ user }) => {
  const RenderSignin = React.useCallback(
    (props: RouteComponentProps) => {
      if (isUserLoading(user)) {
        return <RoutesSkeleton {...props} />;
      } else {
        return <Signin user={user} {...props} />;
      }
    },
    [user],
  );

  return (
    <Switch>
      {isUserLoading(user) || user === null || !user.emailVerified ? (
        <Route render={RenderSignin} />
      ) : null}
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
