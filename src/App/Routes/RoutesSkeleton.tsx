import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { Load } from 'components/Load';
import { NotFound } from 'components/NotFound';
import { IdeaContainerSkeleton, IdeasSkeleton } from 'containers/Idea';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { absolutePrivateRoute } from 'utils/routes';

export const RoutesSkeleton: React.FC = () => {
  const location = useLocation();
  const { pathname } = location;

  if (pathname === absolutePrivateRoute.ideas.path || pathname === '/') {
    return (
      <Box flex={1} display={'flex'} flexDirection={'column'} overflow={'auto'}>
        <Tabs value={false} variant={'fullWidth'}>
          <Load boxFlex={1}>
            <Tab />
          </Load>
          <Load boxFlex={1}>
            <Tab />
          </Load>
        </Tabs>
        <IdeasSkeleton />
      </Box>
    );
  } else if (
    /^\/[\w\d]+$/.test(pathname.split(absolutePrivateRoute.ideas.path).join(''))
  ) {
    return <IdeaContainerSkeleton />;
  } else {
    return <NotFound {...location} />;
  }
};
