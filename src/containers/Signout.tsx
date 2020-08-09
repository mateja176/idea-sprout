import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import ExitToApp from '@material-ui/icons/ExitToApp';
import useBoolean from 'ahooks/es/useBoolean';
import { SnackbarContext } from 'context/snackbar';
import { User } from 'models/auth';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from 'reactfire';
import { clearFirestoreCache } from 'services/firebase';
import { useActions } from 'services/hooks/hooks';
import { createReset } from 'services/store/reducer';

export interface SignoutProps {
  user: User;
  onClick: React.MouseEventHandler;
}

const actionCreators = {
  reset: createReset,
};

export const Signout: React.FC<SignoutProps> = ({ user, onClick }) => {
  const auth = useAuth();

  const { reset } = useActions(actionCreators);

  const { queueSnackbar } = React.useContext(SnackbarContext);

  const history = useHistory();

  const [loading, setLoading] = useBoolean();

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
    [setLoading, history, queueSnackbar, reset, onClick, auth],
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
