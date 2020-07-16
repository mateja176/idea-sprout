import { IconButton, Tooltip } from '@material-ui/core';
import { LibraryAdd } from '@material-ui/icons';
import React from 'react';
import { useCreateIdea } from 'services';

export const CreateIdeaIcon = () => {
  const { create, loading } = useCreateIdea();

  return (
    <Tooltip title={'Create Idea'}>
      <IconButton color={'inherit'} disabled={loading} onClick={create}>
        <LibraryAdd />
      </IconButton>
    </Tooltip>
  );
};
