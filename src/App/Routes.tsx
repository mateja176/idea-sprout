import { Create, IdeaPage, Signin } from 'pages';
import { Discover } from 'pages/Discover';
import { MyIdeas } from 'pages/MyIdeas';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useIsSignedIn } from 'services/hooks';
import urljoin from 'url-join';
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
          render={() => {
            return <Redirect to={privateRoute.discover.path} />;
          }}
        />
      )}
      <Route
        exact
        path={absolutePrivateRoute.discover.path}
        component={Discover}
      />
      <Route path={absolutePrivateRoute.create.path} component={Create} />
      <Route path={absolutePrivateRoute.myIdeas.path} component={MyIdeas} />
      <Route
        path={urljoin(absolutePrivateRoute.idea.path, ':id')}
        component={IdeaPage}
      />
    </Switch>
  );
};
