import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';
import { useBoolean } from 'ahooks';
import { FirebaseError } from 'firebase/app';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { createQueueSnackbar, useActions, useAuth, useUser } from 'services';
import { absolutePublicRoute } from 'utils';

export interface SignoutProps {
  onClick: React.MouseEventHandler;
}

export const Signout: React.FC<SignoutProps> = ({ onClick }) => {
  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const history = useHistory();

  const [loading, setLoading] = useBoolean();

  const auth = useAuth();

  const user = useUser();

  return user ? (
    <Tooltip title={`Sign out of ${user.email}`}>
      <ListItem
        disabled={loading}
        button
        onClick={(e) => {
          setLoading.setTrue();

          auth
            .signOut()
            .then(() => {
              queueSnackbar({
                message: 'Successfully signed out',
                severity: 'success',
              });

              onClick(e);

              history.replace(absolutePublicRoute.signin.path);
            })
            .catch((error: FirebaseError) => {
              // * the operation doesn't fail even if the user is offline
              queueSnackbar({ message: error.message, severity: 'error' });
            })
            .finally(() => {
              setLoading.setFalse();
            });
        }}
      >
        <ListItemIcon>
          <ExitToApp />
        </ListItemIcon>
        <ListItemText>Sign out</ListItemText>
      </ListItem>
    </Tooltip>
  ) : null;
};
