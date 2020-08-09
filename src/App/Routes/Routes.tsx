import { NotFound } from 'components';
import { IdeasSwitch, Signin } from 'pages';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { useAuth as useFirebaseAuth } from 'reactfire';
import { useUserState } from 'services/hooks';
import { selectEmailVerified } from 'services/store';
import { absolutePrivateRoute, isUserLoading } from 'utils';
import { RoutesSkeleton } from './RoutesSkeleton';

const RedirectToIdeas: React.FC<RouteComponentProps> = () => (
  <Redirect to={absolutePrivateRoute.ideas.path} />
);

export const Routes: React.FC = () => {
  useSelector(selectEmailVerified); // * user.reload() does not trigger a re-render

  const user = useUserState();

  const auth = useFirebaseAuth();

  if (isUserLoading(user)) {
    return <RoutesSkeleton />;
  } else if (user === null || !user.emailVerified) {
    return <Signin user={user} auth={auth} />;
  } else {
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
  }
};
