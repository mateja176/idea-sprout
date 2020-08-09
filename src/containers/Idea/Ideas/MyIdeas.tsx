import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Edit from '@material-ui/icons/Edit';
import LibraryAdd from '@material-ui/icons/LibraryAdd';
import Publish from '@material-ui/icons/Publish';
import Share from '@material-ui/icons/Share';
import { User } from 'firebase/app';
import { IdeaModel } from 'models';
import React from 'react';
import FlipMove from 'react-flip-move';
import { useSelector } from 'react-redux';
import {
  useCreateIdea,
  useFirestoreCollection,
  useIdeasRef,
} from 'services/hooks';
import { selectMyIdeas } from 'services/store';
import { IdeaRow } from '../IdeaRow';

export const MyEmptyIdeas = () => {
  const { create, loading } = useCreateIdea();

  return (
    <Box m={3}>
      <List>
        <ListItem>
          <ListItemIcon>
            <LibraryAdd />
          </ListItemIcon>
          <ListItemText>
            Plant an idea seed by clicking on the button below.
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText>
            Updating its <i>name</i>, <i>tagline</i>, <i>story</i> (video),{' '}
            <i>problem-solution</i>, <i>image</i> and
            <i>rationale</i>. You can do this one step at a time.
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Publish />
          </ListItemIcon>
          <ListItemText>
            When you that think it's time to take the spotlight, <i>publish</i>{' '}
            your idea to the world!
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Share />
          </ListItemIcon>
          <ListItemText>
            To help the idea sprout grow, <i>share</i> it with a person or
            people who may like it.
          </ListItemText>
        </ListItem>
      </List>
      <Box mt={2}>
        <Button
          variant={'contained'}
          color={'primary'}
          startIcon={<LibraryAdd />}
          disabled={loading}
          onClick={create}
        >
          Create idea
        </Button>
      </Box>
    </Box>
  );
};

export const MyIdeas: React.FC<{ user: User }> = ({ user }) => {
  const myIdeas = useSelector(selectMyIdeas(user.uid));

  const ideas = useFirestoreCollection<IdeaModel>(
    useIdeasRef().where('author', '==', user.uid).orderBy('createdAt', 'desc'),
    {
      startWithValue: myIdeas.length ? myIdeas : undefined,
    },
  );

  return (
    <Box flex={1} display={'flex'} flexDirection={'column'} overflow={'auto'}>
      {ideas.length <= 0 ? (
        <MyEmptyIdeas />
      ) : (
        <FlipMove>
          {ideas.map((idea) => (
            <IdeaRow key={idea.id} idea={idea} user={user} />
          ))}
        </FlipMove>
      )}
    </Box>
  );
};
