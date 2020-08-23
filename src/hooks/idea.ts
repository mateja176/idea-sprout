import React, { useMemo } from 'react';
import urljoin from 'url-join';
import { PreloadContext } from '../context/preload';
import { absolutePrivateRoute } from '../elements/routes';
import { IdeaModel } from '../models/idea';
import { useOrigin } from './hooks';

export const useIdeaUrl = (id: IdeaModel['id']) => {
  const origin = useOrigin();
  const url = useMemo(
    () => urljoin(origin, absolutePrivateRoute.ideas.path, id),
    [id, origin],
  );

  const { ideaUrl } = React.useContext(PreloadContext);

  return ideaUrl || url;
};
