import { IdeaModel } from 'models';
import { useEffect, useMemo, useState } from 'react';
import urljoin from 'url-join';
import { absolutePrivateRoute } from 'utils';

export const useIdeaUrl = (id: IdeaModel['id']) => {
  const [origin, setOrigin] = useState('');
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return useMemo(() => urljoin(origin, absolutePrivateRoute.ideas.path, id), [
    origin,
    id,
  ]);
};
