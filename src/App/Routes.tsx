import { Box, Tab, Tabs } from '@material-ui/core';
import { Load } from 'components';
import { IdeaContainerSkeleton, IdeasSkeleton } from 'containers';
import { IdeasSwitch, Signin } from 'pages';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { absolutePrivateRoute } from 'utils';

export interface RoutesProps {
  isSignedIn: boolean;
  isLoading: boolean;
}

export const Routes: React.FC<RoutesProps> = ({ isSignedIn, isLoading }) => {
  return (
    <Switch>
      {!isSignedIn && (
        <Route
          render={(props) => {
            const {
              location: { pathname },
            } = props;

            if (isLoading) {
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
                return <Signin {...props} />;
              }
            } else {
              return <Signin {...props} />;
            }
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
