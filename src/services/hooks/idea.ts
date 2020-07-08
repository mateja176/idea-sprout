import { IdeaModel } from 'models';
import { useEffect, useMemo, useState } from 'react';
import urljoin from 'url-join';

export const useIdeaUrl = (id: IdeaModel['id']) => {
  const [origin, setOrigin] = useState('');
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return useMemo(() => urljoin(origin, id), [origin, id]);
};
