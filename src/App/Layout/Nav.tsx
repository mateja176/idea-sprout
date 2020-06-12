import {
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';
import { Link } from 'components';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  createSignout,
  selectIsAuthLoading,
  selectIsSignedOut,
  useActions,
  useIsSignedIn,
} from 'services';
import { absolutePrivateRoutes, absolutePublicRoutes } from 'utils';

export interface NavProps {}

const listStyle: React.CSSProperties = {
  width: 250,
};

export const Nav: React.FC<NavProps> = () => {
  const { signOut } = useActions({ signOut: createSignout.request });

  const isSignedOut = useSelector(selectIsSignedOut);

  const isAuthLoading = useSelector(selectIsAuthLoading);

  const isSignedIn = useIsSignedIn();

  const routes = Object.values(
    isSignedIn ? absolutePrivateRoutes : absolutePublicRoutes,
  );

  return (
    <List style={listStyle}>
      {routes.map(({ label, path, icon }) => (
        <Link key={path} to={path}>
          <ListItem button>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{label}</ListItemText>
          </ListItem>
        </Link>
      ))}
      {!isSignedOut && (
        <ListItem
          button
          onClick={() => {
            signOut();
          }}
        >
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText>
            Sign out {isAuthLoading && <CircularProgress />}
          </ListItemText>
        </ListItem>
      )}
    </List>
  );
};
