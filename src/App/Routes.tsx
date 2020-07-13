import { Box } from '@material-ui/core';
import { IdeasSwitch, Signin } from 'pages';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AuthCheck } from 'reactfire';
import { absolutePrivateRoute } from 'utils';

export interface RoutesProps {}

export const Routes: React.FC<RoutesProps> = () => {
  return (
    <AuthCheck fallback={<Signin />}>
      <Switch>
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
    </AuthCheck>
  );
};
