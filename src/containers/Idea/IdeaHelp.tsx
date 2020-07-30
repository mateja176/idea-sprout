import { IconButton } from '@material-ui/core';
import { Help } from '@material-ui/icons';
import { IdeaModel, User } from 'models';
import React from 'react';
import { useFirestoreDoc, useIdeaRef, useLocalStorageSet } from 'services';

export const IdeaHelp = ({ id, user }: { id: IdeaModel['id']; user: User }) => {
  const idea = useFirestoreDoc<IdeaModel>(useIdeaRef(id));

  const setShouldTourRun = useLocalStorageSet('shouldRunTour');

  const handleHelpClick: React.MouseEventHandler = React.useCallback(() => {
    setShouldTourRun(true);
  }, [setShouldTourRun]);

  return idea?.author === user?.uid ? (
    <IconButton color={'inherit'} onClick={handleHelpClick}>
      <Help />
    </IconButton>
  ) : null;
};
