import { NotFound } from 'components';
import { SnackbarContext } from 'context';
import { IdeasSwitch, Signin } from 'pages';
import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { useAuth, useUserState } from 'services';
import { absolutePrivateRoute, isUserLoading } from 'utils';
import { RoutesSkeleton } from './RoutesSkeleton';

const RedirectToIdeas: React.FC<RouteComponentProps> = () => (
  <Redirect to={absolutePrivateRoute.ideas.path} />
);

const SigninComponent = (props: RouteComponentProps) => {
  const user = useUserState();

  if (isUserLoading(user)) {
    return <RoutesSkeleton {...props} />;
  } else {
    return <Signin user={user} {...props} />;
  }
};

export const Routes: React.FC = () => {
  React.useContext(SnackbarContext); // * user.reload() does not trigger a re-render

  const user = useAuth();

  return (
    <Switch>
      {isUserLoading(user) || user === null || !user.emailVerified ? (
        <Route component={SigninComponent} />
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
