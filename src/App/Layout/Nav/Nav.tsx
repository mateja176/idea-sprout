import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { AcademyLink, Link } from 'components';
import { Signout } from 'containers';
import { SnackbarContext } from 'context';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useUserState } from 'services';
import {
  absolutePrivateNavigationRoutes,
  absolutePublicNavigationRoutes,
  getIsSignedIn,
} from 'utils';

export interface NavProps {
  onClick: React.MouseEventHandler;
}

export const minNavWidth = 250;

export const withNavWidth: React.CSSProperties = {
  minWidth: minNavWidth,
};

export const Nav: React.FC<NavProps> = ({ onClick }) => {
  React.useContext(SnackbarContext); // * user.reload() does not trigger a re-render

  const user = useUserState();
  const isSignedIn = getIsSignedIn(user);

  const routes = isSignedIn
    ? absolutePrivateNavigationRoutes
    : absolutePublicNavigationRoutes;

  const location = useLocation();

  return user === null || user === 'loading' ? null : (
    <List style={withNavWidth}>
      {routes.map(({ label, path, icon }) => (
        <Link key={path} to={path} onClick={onClick}>
          <ListItem button selected={location.pathname === path}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{label}</ListItemText>
          </ListItem>
        </Link>
      ))}
      {!!user && <Signout user={user} onClick={onClick} />}
      {isSignedIn && <AcademyLink />}
    </List>
  );
};
