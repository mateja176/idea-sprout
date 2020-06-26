import firebase from 'firebase/app';
import 'firebase/auth';
import { initialUser, User } from 'models';
import { CreateIdea, EditIdea, IdeaPage, IdeasPage, Signin } from 'pages';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useUser } from 'reactfire';
import urljoin from 'url-join';
import { absolutePrivateRoute, absolutePublicRoute, privateRoute } from 'utils';

export interface RoutesProps {}

export const Routes: React.FC<RoutesProps> = () => {
  const isSignedIn = !!useUser<User | null>(firebase.auth(), {
    startWithValue: initialUser,
  })?.uid;

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
      <Route
        exact
        path={absolutePrivateRoute.ideas.path}
        component={IdeasPage}
      />
      <Route path={absolutePrivateRoute.create.path} component={CreateIdea} />
      <Route
        path={urljoin(absolutePrivateRoute.edit.path, ':id')}
        component={EditIdea}
      />
      <Route path={absolutePrivateRoute.myIdeas.path} component={IdeasPage} />
      <Route
        path={urljoin(absolutePrivateRoute.ideas.path, ':id')}
        component={IdeaPage}
      />
    </Switch>
  );
};
