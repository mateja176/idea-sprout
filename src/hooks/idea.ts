import { absolutePrivateRoute } from 'elements/routes';
import { IdeaModel } from 'models/idea';
import { useMemo } from 'react';
import urljoin from 'url-join';

export const useIdeaUrl = (id: IdeaModel['id']) => {
  return useMemo(
    () => urljoin(process.env.PUBLIC_URL, absolutePrivateRoute.ideas.path, id),
    [id],
  );
};
