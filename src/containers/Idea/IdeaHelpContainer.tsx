import { User, WithId } from 'models';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useUser } from 'reactfire';
import { ideaPath } from 'utils';
import { IdeaHelp } from './IdeaHelp';

export const IdeaHelpContainer = () => {
  const match = useRouteMatch<WithId>({
    path: ideaPath,
    sensitive: true,
    strict: true,
  });

  const user = useUser<User | null>();

  return match && user ? <IdeaHelp id={match.params.id} user={user} /> : null;
};
