import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Create } from '@material-ui/icons';
import { useBoolean } from 'ahooks';
import { User } from 'models';
import qs from 'qs';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { createQueueSnackbar, useActions, useIdeasRef } from 'services';
import { absolutePrivateRoute, getInitialIdea } from 'utils';

export interface CreateIdeaProps {
  user: User;
}

export const CreateIdea: React.FC<CreateIdeaProps> = ({ user }) => {
  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const history = useHistory();

  const ideasRef = useIdeasRef();

  const [loading, setLoading] = useBoolean();

  const createIdea = () => {
    setLoading.setTrue();

    const ideaDoc = ideasRef.doc();

    const newIdea = getInitialIdea(user.uid);

    ideaDoc
      .set(newIdea)
      .then(() => {
        // * the promise is not rejected even if the client is offline
        // * the promise is pending until it resolves or the tab is closed
        queueSnackbar({
          severity: 'success',
          message: 'Update, publish and share to get feedback!',
          autoHideDuration: 10000,
        });

        history.push(
          absolutePrivateRoute.ideas.path.concat(
            '?',
            qs.stringify({ author: user.uid }),
          ),
        );
      })
      .finally(() => {
        setLoading.setFalse();
      });
  };

  return (
    <ListItem button disabled={loading} onClick={createIdea}>
      <ListItemIcon>
        <Create />
      </ListItemIcon>
      <ListItemText>Create</ListItemText>
    </ListItem>
  );
};
