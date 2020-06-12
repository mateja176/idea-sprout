import { Ideas, Signin } from 'pages';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useIsSignedIn } from 'services/hooks';
import { absolutePrivateRoute, absolutePublicRoute, privateRoute } from 'utils';

export interface RoutesProps {}

export const Routes: React.FC<RoutesProps> = () => {
  const isSignedIn = useIsSignedIn();

  return (
    <Switch>
      {!isSignedIn && <Route component={Signin} />}
      {isSignedIn && (
        <Route
          path={absolutePublicRoute.login.path}
          render={(props) => {
            return <Redirect to={privateRoute.ideas.path} />;
          }}
        />
      )}
      <Route path={absolutePrivateRoute.ideas.path} component={Ideas} />
    </Switch>
  );
};
