import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { Load, NotFound } from 'components';
import { IdeaContainerSkeleton, IdeasSkeleton } from 'containers';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { absolutePrivateRoute } from 'utils';

export const RoutesSkeleton: React.FC<RouteComponentProps> = (props) => {
  const {
    location: { pathname },
  } = props;
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
    return <NotFound {...props} />;
  }
};
