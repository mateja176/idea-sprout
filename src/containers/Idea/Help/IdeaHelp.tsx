import IconButton from '@material-ui/core/IconButton';
import Help from '@material-ui/icons/Help';
import { User } from 'models/auth';
import { IdeaModel } from 'models/idea';
import React from 'react';
import { useFirestoreDoc, useIdeaRef } from 'services/hooks/firebase';
import { useLocalStorageSet } from 'services/hooks/hooks';

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
