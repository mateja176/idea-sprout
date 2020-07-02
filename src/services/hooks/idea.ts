import { IdeaModel } from 'models';
import { useEffect, useState } from 'react';
import urljoin from 'url-join';

export const useIdeaUrl = (id: IdeaModel['id']) => {
  const [origin, setOrigin] = useState('');
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const ideaUrl = urljoin(origin, id);

  return ideaUrl;
};
