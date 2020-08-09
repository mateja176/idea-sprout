import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Person from '@material-ui/icons/Person';
import Search from '@material-ui/icons/Search';
import { Ideas, IdeasSkeleton, MyIdeas } from 'containers/Idea';
import { MyIdeasSkeleton } from 'containers/Idea/Ideas/MyIdeasSkeleton';
import qs from 'qs';
import React from 'react';
import { RouteComponentProps, useHistory, useLocation } from 'react-router-dom';
import { useSignedInUser } from 'services/hooks';

export interface IdeasPageProps extends RouteComponentProps {}

export const IdeasPage: React.FC<IdeasPageProps> = () => {
  const history = useHistory();

  const user = useSignedInUser();

  const query = qs.parse(useLocation().search, { ignoreQueryPrefix: true });

  const showMyIdeas = (query.author && query.author) === user.uid;

  const handleDiscover: React.MouseEventHandler = React.useCallback(() => {
    history.push({
      search: qs.stringify({}),
    });
  }, [history]);

  const handleYourIdeasClick: React.MouseEventHandler = React.useCallback(() => {
    history.push({
      search: qs.stringify({ author: user.uid }),
    });
  }, [history, user.uid]);

  return (
    <Box flex={1} display={'flex'} flexDirection={'column'} overflow={'auto'}>
      <Tabs
        value={Number(showMyIdeas)}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab
          label={
            <Box display={'flex'} alignItems={'center'}>
              <Search />
              &nbsp; Discover
            </Box>
          }
          onClick={handleDiscover}
        />
        <Tab
          label={
            <Box display={'flex'} alignItems={'center'}>
              <Person />
              &nbsp; Your Ideas
            </Box>
          }
          onClick={handleYourIdeasClick}
        />
      </Tabs>
      <Box flex={1} display={'flex'} flexDirection={'column'} overflow={'auto'}>
        {showMyIdeas ? (
          <React.Suspense fallback={<MyIdeasSkeleton />}>
            <MyIdeas user={user} />
          </React.Suspense>
        ) : (
          <React.Suspense fallback={<IdeasSkeleton />}>
            <Ideas user={user} />
          </React.Suspense>
        )}
      </Box>
    </Box>
  );
};
