import { Box, Typography } from '@material-ui/core';
import { IdeaModel, User } from 'models';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectMyIdeas,
  useFirestoreCollection,
  useIdeaOptionsButtonBorder,
  useIdeasRef,
} from 'services';
import { CreateIdea } from '../CreateIdea';
import { IdeaRow } from '../IdeaRow';

export const MyEmptyIdeas = ({ user }: { user: User }) => {
  const buttonBorder = useIdeaOptionsButtonBorder();

  return (
    <Box
      m={3}
      mt={5}
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
    >
      <Typography variant="h6">
        I have no idea{' '}
        <span role="img" aria-label="thinking">
          🤔
        </span>{' '}
        Do you?
      </Typography>
      <Box
        mt={2}
        justifySelf={'center'}
        borderRadius={4}
        overflow={'hidden'}
        border={buttonBorder}
      >
        <CreateIdea user={user} />
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
      {ideas.map((idea) => (
        <IdeaRow key={idea.id} idea={idea} uid={user.uid} />
      ))}
    </Box>
  );
};
