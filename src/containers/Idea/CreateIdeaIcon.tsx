import { IconButton, Tooltip } from '@material-ui/core';
import { LibraryAdd } from '@material-ui/icons';
import { User } from 'models';
import React from 'react';
import { useUser } from 'reactfire';
import { useCreateIdea } from 'services';

export const CreateIdeaIcon = () => {
  const user = useUser<User | null>();

  const { create, loading } = useCreateIdea();

  return user ? (
    <Tooltip title={'Create Idea'}>
      <IconButton color={'inherit'} disabled={loading} onClick={create}>
        <LibraryAdd />
      </IconButton>
    </Tooltip>
  ) : null;
};
