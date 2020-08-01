import { Box, Tab, Tabs } from '@material-ui/core';
import { Load } from 'components';
import { IdeaContainerSkeleton, IdeasSkeleton } from 'containers';
import { User } from 'firebase';
import { LayoutChildrenProps } from 'models';
import { IdeasSwitch, Signin } from 'pages';
import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { absolutePrivateRoute, isInitialUser } from 'utils';

export interface RoutesProps extends LayoutChildrenProps {}

const NotFound: React.FC<RouteComponentProps> = () => (
  <Box mt={4} display="flex" justifyContent="center">
    Not Found
  </Box>
);

export const Routes: React.FC<RoutesProps> = ({ user, setEmailVerified }) => {
  return (
    <Switch>
      {user === null || isInitialUser(user) || !(user as User).emailVerified ? (
        <Route
          render={(props) => {
            const {
              location: { pathname },
            } = props;

            if (user === null) {
              return (
                <Signin
                  setEmailVerified={setEmailVerified}
                  user={user}
                  {...props}
                />
              );
            } else if (isInitialUser(user)) {
              if (
                pathname === absolutePrivateRoute.ideas.path ||
                pathname === '/'
              ) {
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
                return <NotFound {...props} />;
              }
            } else {
              return (
                <Signin
                  setEmailVerified={setEmailVerified}
                  user={user as User}
                  {...props}
                />
              );
            }
          }}
        />
      ) : null}
      <Route
        exact
        path={absolutePrivateRoute.root.path}
        render={() => <Redirect to={absolutePrivateRoute.ideas.path} />}
      />
      <Route path={absolutePrivateRoute.ideas.path} component={IdeasSwitch} />
      <Route component={NotFound} />
    </Switch>
  );
};
