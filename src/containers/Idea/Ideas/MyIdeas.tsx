import { Box, Typography } from '@material-ui/core';
import { IdeaModel, User } from 'models';
import React from 'react';
import { useFirestoreCollection, useIdeasRef } from 'services';
import { CreateIdea } from '../CreateIdea';
import { IdeaRow } from '../IdeaRow';

export const MyIdeas: React.FC<{ user: User }> = ({ user }) => {
  const ideas = useFirestoreCollection<IdeaModel>(
    useIdeasRef().where('author', '==', user.email),
  );

  return (
    <Box>
      {ideas.length <= 0 ? (
        <Box m={3}>
          <Typography variant="h6">
            I have no idea{' '}
            <span role="img" aria-label="thinking">
              🤔
            </span>{' '}
            Do you?
          </Typography>
          <Box mt={2}>
            <CreateIdea user={user} />
          </Box>
        </Box>
      ) : (
        ideas.map((idea) => <IdeaRow key={idea.id} idea={idea} user={user} />)
      )}
    </Box>
  );
};
