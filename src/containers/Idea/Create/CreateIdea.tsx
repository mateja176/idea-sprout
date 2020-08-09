import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LibraryAdd from '@material-ui/icons/LibraryAdd';
import { User } from 'models/auth';
import React from 'react';
import { useCreateIdea } from 'services/hooks/firebase';

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
