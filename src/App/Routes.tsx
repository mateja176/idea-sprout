import { Box } from '@material-ui/core';
import { IdeasSwitch, Signin } from 'pages';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useUser } from 'services';
import { absolutePrivateRoute, absolutePublicRoute } from 'utils';
import { initialUser } from 'models';

export interface RoutesProps {}

export const Routes: React.FC<RoutesProps> = () => {
  const isSignedIn = !!useUser({
    startWithValue: initialUser,
  })?.uid;

  return (
    <Switch>
      {!isSignedIn && <Route component={Signin} />}
      {isSignedIn && (
        <Route
          path={absolutePublicRoute.signin.path}
          render={() => {
            return <Redirect to={absolutePrivateRoute.ideas.path} />;
          }}
        />
      )}
      <Route
        exact
        path={absolutePrivateRoute.root.path}
        render={() => <Redirect to={absolutePrivateRoute.ideas.path} />}
      />
      <Route path={absolutePrivateRoute.ideas.path} component={IdeasSwitch} />
      <Route
        render={() => (
          <Box mt={4} display="flex" justifyContent="center">
            Not Found
          </Box>
        )}
      />
    </Switch>
  );
};
