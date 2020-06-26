import {
  CircularProgress,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';
import { FirebaseError } from 'firebase/app';
import { AsyncState, User } from 'models';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth, useUser } from 'reactfire';
import { createQueueSnackbar, useActions } from 'services';
import { absolutePublicRoute } from 'utils';

export interface SignoutProps {
  onClick: React.MouseEventHandler;
}

export const Signout: React.FC<SignoutProps> = ({ onClick }) => {
  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const history = useHistory();

  const [status, setStatus] = React.useState<AsyncState<null>>('initial');

  const auth = useAuth();

  const user = useUser<User | null>();

  return user ? (
    <Tooltip title={`Sign out of ${user.email}`}>
      <ListItem
        button
        onClick={(e) => {
          setStatus('loading');

          auth
            .signOut()
            .then(() => {
              queueSnackbar({
                message: 'Successfully signed out',
                severity: 'success',
              });

              setStatus(null);

              onClick(e);

              history.push(absolutePublicRoute.signin.path);
            })
            .catch((error: FirebaseError) => {
              queueSnackbar({ message: error.message, severity: 'success' });

              setStatus(error);
            });
        }}
      >
        <ListItemIcon>
          <ExitToApp />
        </ListItemIcon>
        <ListItemText>
          Sign out {status === 'loading' && <CircularProgress size="1em" />}
        </ListItemText>
      </ListItem>
    </Tooltip>
  ) : null;
};
