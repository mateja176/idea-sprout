import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import LibraryAdd from '@material-ui/icons/LibraryAdd';
import 'firebase/firestore';
import React from 'react';
import { useCreateIdea, useMaybeUser } from '../../../hooks/firebase';

export const CreateIdeaIcon = () => {
  const user = useMaybeUser();

  const { create, loading } = useCreateIdea();

  return user ? (
    <Tooltip title={'Create Idea'}>
      <IconButton color={'inherit'} disabled={loading} onClick={create}>
        <LibraryAdd />
      </IconButton>
    </Tooltip>
  ) : null;
};
