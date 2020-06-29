import { Box, List } from '@material-ui/core';
import { IdeaRow } from 'containers';
import { IdeaFilter, IdeaModel, User } from 'models';
import React from 'react';
import { useFirestoreCollection, useIdeasRef, useSignedInUser } from 'services';
import { ideaListStyle, pageMargin } from 'styles';
import { getIsAuthor } from 'utils';

export interface IdeasProps<Key extends keyof IdeaModel> {
  filter: (user: User) => IdeaFilter<Key>;
}

export const Ideas = <Key extends keyof IdeaModel>({
  filter,
}: IdeasProps<Key>) => {
  const ideasRef = useIdeasRef();

  const user = useSignedInUser();

  const { fieldPath, opStr, value } = filter(user);

  const filteredIdeasRef = ideasRef
    .where(fieldPath, opStr, value)
    .orderBy('createdAt', 'desc');

  const ideas = useFirestoreCollection<IdeaModel>(filteredIdeasRef);

  return (
    <Box mt={pageMargin}>
      <List style={ideaListStyle}>
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
