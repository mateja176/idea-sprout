import { useMemo } from 'react';
import urljoin from 'url-join';
import { absolutePrivateRoute } from '../elements/routes';
import { IdeaModel } from '../models/idea';
import { useOrigin } from './hooks';

export const useIdeaUrl = (id: IdeaModel['id']) => {
  const origin = useOrigin();
  return useMemo(() => urljoin(origin, absolutePrivateRoute.ideas.path, id), [
    id,
    origin,
  ]);
};
