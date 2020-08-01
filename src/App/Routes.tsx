import { Box, Tab, Tabs } from '@material-ui/core';
import { Load } from 'components';
import { IdeaContainerSkeleton, IdeasSkeleton } from 'containers';
import { User } from 'firebase';
import { initialUser } from 'models';
import { IdeasSwitch, Signin } from 'pages';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useUser } from 'services';
import { absolutePrivateRoute, absolutePublicRoute } from 'utils';

export interface RoutesProps {}

function isFirebaseUser(user: User | typeof initialUser): user is User {
  return !!user.uid;
}

export const Routes: React.FC<RoutesProps> = () => {
  const user = useUser<User | typeof initialUser>({
    startWithValue: initialUser,
  });
  const uid = user?.uid;
  const isLoading = uid === initialUser.uid;
  const isSignedIn = user && isFirebaseUser(user) && user.emailVerified;

  return (
    <Switch>
      {!isSignedIn && (
        <Route
          render={(props) => {
            const {
              location: { pathname },
            } = props;

            if (isLoading) {
              if (pathname === absolutePrivateRoute.ideas.path) {
                return (
                  <Box
                    flex={1}
                    display={'flex'}
                    flexDirection={'column'}
                    overflow={'auto'}
                  >
                    <Tabs value={false} variant={'fullWidth'}>
                      <Load boxFlex={1}>
                        <Tab />
                      </Load>
                      <Load boxFlex={1}>
                        <Tab />
                      </Load>
                    </Tabs>
                    <IdeasSkeleton />
                  </Box>
                );
              } else if (
                /^\/[\w\d]+$/.test(
                  pathname.split(absolutePrivateRoute.ideas.path).join(''),
                )
              ) {
                return <IdeaContainerSkeleton />;
              } else {
                return <Signin {...props} />;
              }
            } else {
              return <Signin {...props} />;
            }
          }}
        />
      )}
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
