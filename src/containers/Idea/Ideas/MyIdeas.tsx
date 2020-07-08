import { Box, Typography } from '@material-ui/core';
import { IdeaModel, User } from 'models';
import React from 'react';
import { useFirestoreCollection, useIdeasRef } from 'services';
import { CreateIdea } from '../CreateIdea';
import { IdeaRow } from '../IdeaRow';
import { IdeasSkeleton } from './IdeasSkeleton';

export const MyEmptyIdeas = ({ user }: { user: User }) => (
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
);

export const MyIdeas: React.FC<{ user: User }> = ({ user }) => {
  const ideas = useFirestoreCollection<IdeaModel>(
    useIdeasRef()
      .where('author', '==', user.email)
      .orderBy('createdAt', 'desc'),
  );

  return (
    <Box>
      {ideas.length <= 0 ? (
        // * Displaying a Skeleton is preferable considering the case of an user with a number ideas
        // * landing on a page where he is prompted to created his or her first idea
        <IdeasSkeleton />
      ) : (
        ideas.map((idea) => (
          <IdeaRow
            key={idea.id}
            idea={idea}
            email={user.email}
            uid={user.uid}
          />
        ))
      )}
    </Box>
  );
};
