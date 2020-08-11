import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import LibraryAdd from '@material-ui/icons/LibraryAdd';
import { useCreateIdea, useUser } from 'hooks/firebase';
import React from 'react';

export const CreateIdeaIcon = () => {
  const user = useUser();

  const { create, loading } = useCreateIdea();

  return user ? (
    <Tooltip title={'Create Idea'}>
      <IconButton color={'inherit'} disabled={loading} onClick={create}>
        <LibraryAdd />
      </IconButton>
    </Tooltip>
  ) : null;
};
