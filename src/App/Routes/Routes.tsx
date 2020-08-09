import { NotFound } from 'components/NotFound';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { useAuth as useFirebaseAuth } from 'reactfire';
import { useUserState } from 'services/hooks/firebase';
import { selectEmailVerified } from 'services/store';
import { isUserLoading } from 'utils/auth';
import { absolutePrivateRoute } from 'utils/routes';
import { RoutesSkeleton } from './RoutesSkeleton';

const Signin = React.lazy(() => import('pages/Signin'));

const LazyIdeasSwitch = React.lazy(() => import('pages/Idea/IdeasSwitch'));
const IdeasSwitchSuspender: React.FC<RouteComponentProps> = (props) => (
  <React.Suspense fallback={RoutesSkeleton}>
    <LazyIdeasSwitch {...props} />
  </React.Suspense>
);

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
      <React.Suspense fallback={RoutesSkeleton}>
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
          path={absolutePrivateRoute.ideas.path}
          component={IdeasSwitchSuspender}
        />
        <Route component={NotFound} />
      </Switch>
    );
  }
};
