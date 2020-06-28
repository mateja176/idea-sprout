import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { Link } from 'components';
import { Signout } from 'containers';
import { User } from 'models';
import React from 'react';
import { useUser } from 'reactfire';
import {
  absolutePrivateNavigationRoutes,
  absolutePublicNavigationRoutes,
} from 'utils';

export interface NavProps {
  onClick: React.MouseEventHandler;
}

export const minNavWidth = 250;

export const withNavWidth: React.CSSProperties = {
  minWidth: minNavWidth,
};

export const Nav: React.FC<NavProps> = ({ onClick }) => {
  const isSignedIn = !!useUser<User | null>();

  const routes = isSignedIn
    ? absolutePrivateNavigationRoutes
    : absolutePublicNavigationRoutes;

  return (
    <List style={withNavWidth}>
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
