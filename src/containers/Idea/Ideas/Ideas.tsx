import { Box, List } from '@material-ui/core';
import { IdeaRow } from 'containers';
import { IdeaModel } from 'models';
import React from 'react';
import { useFirestoreCollection, useIdeasRef, useSignedInUser } from 'services';
import { useRouteMatch } from 'react-router-dom';
import { absolutePrivateRoute } from 'utils';

export interface IdeasProps {}
export const Ideas: React.FC<IdeasProps> = () => {
  const ideasRef = useIdeasRef();

  const user = useSignedInUser();

  const { path } = useRouteMatch();

  const isAuthor = path === absolutePrivateRoute.myIdeas.path;

  const filteredIdeasRef = isAuthor
    ? ideasRef.where('author', '==', user.email)
    : ideasRef;

  const ideas = useFirestoreCollection<IdeaModel>(filteredIdeasRef);

  return (
    <Box>
      <List>
        {ideas.map((idea) => {
          return <IdeaRow key={idea.id} idea={idea} isAuthor={isAuthor} />;
        })}
      </List>
    </Box>
  );
};
