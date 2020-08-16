import { NotFound } from 'components/NotFound';
import { absolutePrivateRoute } from 'elements/routes';
import { useUserState } from 'hooks/firebase';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { useAuth as useFirebaseAuth } from 'reactfire';
import { selectEmailVerified } from 'services/store/slices/auth';
import { isUserLoading } from 'utils/auth';
import IdeasSwitch from '../pages/Idea/IdeasSwitch';
import { RoutesSkeleton } from './RoutesSkeleton';

const Signin = React.lazy(() => import('../pages/Signin'));

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
    return (
      <React.Suspense fallback={<RoutesSkeleton />}>
        <Signin user={user} auth={auth} />
      </React.Suspense>
    );
  } else {
    return (
      <Switch>
        <Route
          exact
          path={absolutePrivateRoute.root.path}
          component={RedirectToIdeas}
        />
        <Route
          exact
          path={absolutePrivateRoute.ideas.path}
          component={IdeasSwitch}
        />
        <Route component={NotFound} />
      </Switch>
    );
  }
};
