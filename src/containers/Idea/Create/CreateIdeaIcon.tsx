import { IconButton, Tooltip } from '@material-ui/core';
import { LibraryAdd } from '@material-ui/icons';
import React from 'react';
import { useCreateIdea, useUser } from 'services';

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
