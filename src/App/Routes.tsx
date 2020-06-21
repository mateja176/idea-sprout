import { IdeaForm, IdeaPage, Ideas, Signin } from 'pages';
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
          path={absolutePublicRoute.signin.path}
          render={() => {
            return <Redirect to={privateRoute.ideas.path} />;
          }}
        />
      )}
      <Route exact path={absolutePrivateRoute.ideas.path} component={Ideas} />
      <Route path={absolutePrivateRoute.create.path} component={IdeaForm} />
      <Route path={absolutePrivateRoute.myIdeas.path} component={MyIdeas} />
      <Route
        path={urljoin(absolutePrivateRoute.ideas.path, ':id')}
        component={IdeaPage}
      />
    </Switch>
  );
};
