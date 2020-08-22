import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Person from '@material-ui/icons/Person';
import Search from '@material-ui/icons/Search';
import qs from 'qs';
import React from 'react';
import { RouteComponentProps, useHistory, useLocation } from 'react-router-dom';
import Ideas from '../../../../containers/Idea/Ideas/Ideas';
import IdeasSkeleton from '../../../../containers/Idea/Ideas/IdeasSkeleton';
import { MyIdeas } from '../../../../containers/Idea/Ideas/MyIdeas';
import MyIdeasSkeleton from '../../../../containers/Idea/Ideas/MyIdeasSkeleton';
import LazySignin from '../../../../containers/Signin/LazySignin';
import { useUser } from '../../../../hooks/firebase';
import { WithUser } from '../../../../models/auth';
import IdeasPageSkeleton from './IdeasPageSkeleton';

export interface IdeasPageProps extends RouteComponentProps {}

const IdeasPage: React.FC<IdeasPageProps & WithUser> = ({ user }) => {
  const history = useHistory();

  const location = useLocation();

  const query = React.useMemo(
    () => qs.parse(location.search, { ignoreQueryPrefix: true }),
    [location],
  );

  const showMyIdeas = !!query.author && query.author === user.uid;

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

IdeasPage.displayName = 'IdeasPage';

const IdeasPageWithUser = (props: IdeasPageProps) => {
  const user = useUser();

  if (user === null || !user.emailVerified) {
    return <LazySignin user={user} />;
  } else {
    return <IdeasPage {...props} user={user} />;
  }
};

const IdeasPageSuspender = (props: IdeasPageProps) => {
  return (
    <React.Suspense fallback={IdeasPageSkeleton}>
      <IdeasPageWithUser {...props} />
    </React.Suspense>
  );
};

export default IdeasPageSuspender;
