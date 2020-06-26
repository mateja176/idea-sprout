import { Box, List } from '@material-ui/core';
import { IdeaRow } from 'containers';
import { IdeaModel } from 'models';
import React from 'react';
import { useFirestoreCollection, useIdeasRef } from 'services';

export interface IdeasProps {}
export const Ideas: React.FC<IdeasProps> = () => {
  const ideasRef = useIdeasRef();

  const ideas = useFirestoreCollection<IdeaModel>(ideasRef);

  return (
    <Box>
      <List>
        {ideas.map((idea) => {
          return <IdeaRow key={idea.id} idea={idea} />;
        })}
      </List>
    </Box>
  );
};
