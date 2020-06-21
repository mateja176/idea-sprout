import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { Link } from 'components';
import { Signout } from 'containers';
import React from 'react';
import { useIsSignedIn } from 'services';
import {
  absolutePrivateNavigationRoutes,
  absolutePublicNavigationRoutes,
} from 'utils';

export interface NavProps {
  onClick: React.MouseEventHandler;
}

const listStyle: React.CSSProperties = {
  width: 250,
};

export const Nav: React.FC<NavProps> = ({ onClick }) => {
  const isSignedIn = useIsSignedIn();

  const routes = Object.values(
    isSignedIn
      ? absolutePrivateNavigationRoutes
      : absolutePublicNavigationRoutes,
  );

  return (
    <List style={listStyle}>
      {routes.map(({ label, path, icon }) => (
        <Link key={path} to={path} onClick={onClick}>
          <ListItem button>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{label}</ListItemText>
          </ListItem>
        </Link>
      ))}
      <React.Suspense fallback={<Skeleton />}>
        <Signout onClick={onClick} />
      </React.Suspense>
    </List>
  );
};
