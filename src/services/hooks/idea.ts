import { IdeaModel } from 'models';
import { useMemo } from 'react';
import urljoin from 'url-join';
import { absolutePrivateRoute } from 'utils';

export const useIdeaUrl = (id: IdeaModel['id']) => {
  return useMemo(
    () => urljoin(process.env.PUBLIC_URL, absolutePrivateRoute.ideas.path, id),
    [id],
  );
};
