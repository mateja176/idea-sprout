import { WithId } from 'models';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useUser } from 'services';
import { ideaPath } from 'utils';
import { IdeaHelp } from './IdeaHelp';

export const IdeaHelpContainer = () => {
  const match = useRouteMatch<WithId>({
    path: ideaPath,
    sensitive: true,
    strict: true,
  });

  const user = useUser();

  return match && user ? <IdeaHelp id={match.params.id} user={user} /> : null;
};
