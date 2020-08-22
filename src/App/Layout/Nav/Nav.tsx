import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AcademyLink } from '../../../components/AcademyLink';
import { Link } from '../../../components/Link';
import { Signout } from '../../../containers/Signout';
import {
  absolutePrivateNavigationRoutes,
  absolutePublicNavigationRoutes,
} from '../../../elements/routes';
import { useUserState } from '../../../hooks/firebase';
import { selectEmailVerified } from '../../../services/store/slices/auth';
import { getIsSignedIn } from '../../../utils/auth';
import { NavItemSkeleton } from './NavSkeleton';

export interface NavProps {
  onClick: React.MouseEventHandler;
}

export const minNavWidth = 250;

export const withNavWidth: React.CSSProperties = {
  minWidth: minNavWidth,
};

export const Nav: React.FC<NavProps> = ({ onClick }) => {
  useSelector(selectEmailVerified); // * user.reload() does not trigger a re-render

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
      {!!user && (
        <React.Suspense fallback={NavItemSkeleton}>
          <Signout user={user} onClick={onClick} />
        </React.Suspense>
      )}
      {isSignedIn && <AcademyLink />}
    </List>
  );
};
