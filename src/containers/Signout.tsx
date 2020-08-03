import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';
import { useBoolean } from 'ahooks';
import { User } from 'models';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  clearFirestoreCache,
  createQueueSnackbar,
  createReset,
  useActions,
  useAuth,
} from 'services';

export interface SignoutProps {
  user: User;
  onClick: React.MouseEventHandler;
}

const actionCreators = {
  reset: createReset,
  queueSnackbar: createQueueSnackbar,
};

export const Signout: React.FC<SignoutProps> = ({ user, onClick }) => {
  const { reset, queueSnackbar } = useActions(actionCreators);

  const history = useHistory();

  const [loading, setLoading] = useBoolean();

  const auth = useAuth();

  const handleSignout: React.MouseEventHandler = React.useCallback(
    (e) => {
      setLoading.setTrue();

      auth
        .signOut()
        // * the operation resolves even if the client is offline
        .then(() => {
          onClick(e);

          history.replace('/');

          reset();

          clearFirestoreCache();

          queueSnackbar({
            message: 'Successfully signed out',
            severity: 'success',
          });
        })
        .finally(() => {
          setLoading.setFalse();
        });
    },
    [auth, setLoading, history, queueSnackbar, reset, onClick],
  );

  return user ? (
    <Tooltip title={`Sign out of ${user.email}`}>
      <ListItem disabled={loading} button onClick={handleSignout}>
        <ListItemIcon>
          <ExitToApp />
        </ListItemIcon>
        <ListItemText>Sign out</ListItemText>
      </ListItem>
    </Tooltip>
  ) : null;
};
