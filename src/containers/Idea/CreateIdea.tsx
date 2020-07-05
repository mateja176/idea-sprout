import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Create } from '@material-ui/icons';
import { useBoolean } from 'ahooks';
import firebase from 'firebase/app';
import { RawIdea, User } from 'models';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  createQueueSnackbar,
  useActions,
  useIdeasCountRef,
  useIdeasRef,
} from 'services';
import urljoin from 'url-join';
import { absolutePrivateRoute } from 'utils';

export interface CreateIdeaProps {
  user: User;
}

export const CreateIdea: React.FC<CreateIdeaProps> = ({ user }) => {
  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const history = useHistory();

  const ideasRef = useIdeasRef();

  const ideasCountRef = useIdeasCountRef();

  const [loading, setLoading] = useBoolean();

  const createIdea = () => {
    setLoading.setTrue();

    const newIdea: RawIdea = {
      author: user.email || '',
      checks: {
        niche: true,
        expectations: true,
      },
      createdAt: firebase.firestore.Timestamp.now(),
      sharedBy: [],
      status: 'seed',
      name: 'Apple Computers',
      problemSolution:
        'Computers are an invaluable source of information, they save precious time and help us connect with other people. Computers make our lives better.',
      story: {
        path: 'videos/placeholder-story.mp4',
        width: 1920,
        height: 1080,
      },
      images: [
        {
          path: 'images/placeholder-image.png',
          width: 1920,
          height: 1080,
        },
      ],
      rationale:
        'Computers enable us to write messages, talk to friends and family, watch videos, share images, learn and teach others, manage finances, buy online, manage calendars, look up addresses, translate text, play games and many more things',
    };

    Promise.all([
      ideasRef.add(newIdea),
      ideasCountRef.update({ count: firebase.firestore.FieldValue.increment(1) }),
    ])
      .then(([{ id }]) => {
        // * the promise is not rejected even if the client is offline
        // * the promise is pending until it resolves or the tab is closed
        queueSnackbar({
          severity: 'success',
          message: 'Update it and publish. Good luck!',
          autoHideDuration: 10000,
        });

        history.push(urljoin(absolutePrivateRoute.ideas.path, id), {
          idea: { ...newIdea, id },
          reviews: [],
        });
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
