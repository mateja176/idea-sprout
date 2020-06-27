import { Box, List } from '@material-ui/core';
import { IdeaRow } from 'containers';
import firebase from 'firebase/app';
import { IdeaModel, RawIdea, User } from 'models';
import React from 'react';
import { useFirestoreCollection, useIdeasRef, useSignedInUser } from 'services';
import { getIsAuthor } from 'utils';

export interface IdeasProps<Key extends keyof RawIdea> {
  filter: (
    user: User,
  ) => { fieldPath: Key; opStr: firebase.firestore.WhereFilterOp; value: any };
}

export const Ideas = <Key extends keyof RawIdea>({
  filter,
}: IdeasProps<Key>) => {
  const ideasRef = useIdeasRef();

  const user = useSignedInUser();

  const { fieldPath, opStr, value } = filter(user);

  const filteredIdeasRef = ideasRef.where(fieldPath, opStr, value);

  const ideas = useFirestoreCollection<IdeaModel>(filteredIdeasRef);

  return (
    <Box>
      <List>
        {ideas.map((idea) => {
          return (
            <IdeaRow
              key={idea.id}
              idea={idea}
              isAuthor={getIsAuthor(user)(idea)}
            />
          );
        })}
      </List>
    </Box>
  );
};
