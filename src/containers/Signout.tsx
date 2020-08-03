import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';
import { useBoolean } from 'ahooks';
import { SnackbarContext } from 'context';
import firebase from 'firebase/app';
import 'firebase/auth';
import { User } from 'models';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { clearFirestoreCache, createReset, useActions } from 'services';

export interface SignoutProps {
  user: User;
  onClick: React.MouseEventHandler;
}

const actionCreators = {
  reset: createReset,
};

export const Signout: React.FC<SignoutProps> = ({ user, onClick }) => {
  const { reset } = useActions(actionCreators);

  const { queueSnackbar } = React.useContext(SnackbarContext);

  const history = useHistory();

  const [loading, setLoading] = useBoolean();

  const handleSignout: React.MouseEventHandler = React.useCallback(
    (e) => {
      setLoading.setTrue();

      firebase
        .auth()
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
    [setLoading, history, queueSnackbar, reset, onClick],
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
