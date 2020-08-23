import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { ideaPath } from '../../../elements/routes';
import { useMaybeUser } from '../../../hooks/firebase';
import { WithId } from '../../../models/models';
import { IdeaHelp } from './IdeaHelp';

export const IdeaHelpContainer = () => {
  const match = useRouteMatch<WithId>({
    path: ideaPath,
    sensitive: true,
    strict: true,
  });

  const user = useMaybeUser();

  return match && user ? <IdeaHelp id={match.params.id} user={user} /> : null;
};
