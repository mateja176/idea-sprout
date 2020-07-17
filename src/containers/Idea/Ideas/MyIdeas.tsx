import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core';
import { LibraryAdd, Edit, Publish, Share } from '@material-ui/icons';
import { IdeaModel, User } from 'models';
import React from 'react';
import FlipMove from 'react-flip-move';
import { useSelector } from 'react-redux';
import {
  selectMyIdeas,
  useCreateIdea,
  useFirestoreCollection,
  useIdeasRef,
} from 'services';
import { IdeaRow } from '../IdeaRow';

export const MyEmptyIdeas = ({ user }: { user: User }) => {
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
        <MyEmptyIdeas user={user} />
      ) : (
        <FlipMove>
          {ideas.map((idea) => (
            <IdeaRow key={idea.id} idea={idea} uid={user.uid} />
          ))}
        </FlipMove>
      )}
    </Box>
  );
};
