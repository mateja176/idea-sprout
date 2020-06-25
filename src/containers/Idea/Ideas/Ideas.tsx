import { Box, List } from '@material-ui/core';
import { IdeaRow } from 'containers';
import firebase from 'firebase/app';
import { IdeaModel, RawIdea } from 'models';
import React from 'react';
import { useFirestoreCollection } from 'reactfire';
import { useIdeasRef } from 'services';

export interface IdeasProps {}
export const Ideas: React.FC<IdeasProps> = () => {
  const ideasRef = useIdeasRef();

  const ideasSnapshot = useFirestoreCollection<undefined>(
    ideasRef,
  ) as firebase.firestore.QuerySnapshot<RawIdea>;
  const ideas: IdeaModel[] = ideasSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

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
