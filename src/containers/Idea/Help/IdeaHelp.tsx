import IconButton from '@material-ui/core/IconButton';
import Help from '@material-ui/icons/Help';
import React from 'react';
import { useFirestoreDoc, useIdeaRef } from '../../../hooks/firebase';
import { useLocalStorageSet } from '../../../hooks/hooks';
import { User } from '../../../models/auth';
import { IdeaModel } from '../../../models/idea';

export const IdeaHelp = ({ id, user }: { id: IdeaModel['id']; user: User }) => {
  const idea = useFirestoreDoc<IdeaModel>(useIdeaRef(id));

  const setShouldTourRun = useLocalStorageSet('shouldRunTour');

  const handleHelpClick: React.MouseEventHandler = React.useCallback(() => {
    setShouldTourRun(true);
  }, [setShouldTourRun]);

  return idea?.author === user?.uid ? (
    <IconButton color={'inherit'} onClick={handleHelpClick} aria-label={'Help'}>
      <Help />
    </IconButton>
  ) : null;
};
