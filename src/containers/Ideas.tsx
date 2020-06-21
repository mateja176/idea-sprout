import { Box, List } from '@material-ui/core';
import { IdeaRow } from 'containers';
import firebase from 'firebase/app';
import { IdeaModel, RawIdea } from 'models';
import React from 'react';
import { useFirestoreCollection } from 'reactfire';
import { useIdeas } from 'services';

export interface IdeasProps {}
export const Ideas: React.FC<IdeasProps> = () => {
  const ideasRef = useIdeas();

  const ideasSnapshot = (useFirestoreCollection<RawIdea>(
    ideasRef,
  ) as unknown) as firebase.firestore.QuerySnapshot<RawIdea>;
  const ideas: IdeaModel[] = ideasSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  return (
    <Box>
      <List>
        {ideas.map((idea, i) => {
          return <IdeaRow key={idea.id} i={i} idea={idea} />;
        })}
      </List>
    </Box>
  );
};
