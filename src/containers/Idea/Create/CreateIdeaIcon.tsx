import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import LibraryAdd from '@material-ui/icons/LibraryAdd';
import 'firebase/firestore';
import React from 'react';
import { useCreateIdea, useUser } from '../../../hooks/firebase';
import { getIsSignedIn } from '../../../utils/auth';

export const CreateIdeaIcon = () => {
  const user = useUser();
  const isSignedIn = getIsSignedIn(user);

  const { create, loading } = useCreateIdea();

  return isSignedIn ? (
    <Tooltip title={'Create Idea'}>
      <IconButton color={'inherit'} disabled={loading} onClick={create}>
        <LibraryAdd />
      </IconButton>
    </Tooltip>
  ) : null;
};
