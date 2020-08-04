import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { LibraryAdd } from '@material-ui/icons';
import { User } from 'models';
import React from 'react';
import { useCreateIdea } from 'services';

export interface CreateIdeaProps {
  user: User;
}

export const CreateIdea: React.FC<CreateIdeaProps> = () => {
  const { create, loading } = useCreateIdea();

  return (
    <ListItem button disabled={loading} onClick={create}>
      <ListItemIcon>
        <LibraryAdd />
      </ListItemIcon>
      <ListItemText>Create</ListItemText>
    </ListItem>
  );
};
