import { Box, Tab, Tabs } from '@material-ui/core';
import { Load } from 'components';
import { IdeaContainerSkeleton, IdeasSkeleton } from 'containers';
import { WithUserState } from 'models';
import { IdeasSwitch, Signin } from 'pages';
import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { absolutePrivateRoute, isUserLoading } from 'utils';

export interface RoutesProps extends WithUserState {}

const NotFound: React.FC<RouteComponentProps> = () => (
  <Box mt={4} display="flex" justifyContent="center">
    Not Found
  </Box>
);

export const Routes: React.FC<RoutesProps> = ({ user }) => {
  return (
    <Switch>
      {isUserLoading(user) || user === null || !user.emailVerified ? (
        <Route
          render={(props) => {
            const {
              location: { pathname },
            } = props;

            if (isUserLoading(user)) {
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
            } else if (user === null) {
              return <Signin user={user} {...props} />;
            } else {
              return <Signin user={user} {...props} />;
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
