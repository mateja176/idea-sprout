import { NotFound } from 'components/NotFound';
import { IdeaContainerSkeleton } from 'containers/Idea/IdeaContainerSkeleton';
import { IdeasPageSkeleton } from 'pages/Idea/IdeasPageSkeleton';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { absolutePrivateRoute } from 'utils/routes';

export const RoutesSkeleton: React.FC = () => {
  const location = useLocation();
  const { pathname } = location;

  if (pathname === absolutePrivateRoute.ideas.path || pathname === '/') {
    return <IdeasPageSkeleton />;
  } else if (
    /^\/[\w\d]+$/.test(pathname.split(absolutePrivateRoute.ideas.path).join(''))
  ) {
    return <IdeaContainerSkeleton />;
  } else {
    return <NotFound {...location} />;
  }
};
