import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Link } from 'components';
import { Signout } from 'containers';
import React from 'react';
import { useUser } from 'services';
import { useLocation } from 'react-router-dom';
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
  const user = useUser();
  const isSignedIn = !!user;

  const routes = isSignedIn
    ? absolutePrivateNavigationRoutes
    : absolutePublicNavigationRoutes;

  const location = useLocation();

  return (
    <List style={withNavWidth}>
      {routes.map(({ label, path, icon }) => (
        <Link key={path} to={path} onClick={onClick}>
          <ListItem button selected={location.pathname.startsWith(path)}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{label}</ListItemText>
          </ListItem>
        </Link>
      ))}
      {!!user && <Signout user={user} onClick={onClick} />}
    </List>
  );
};
