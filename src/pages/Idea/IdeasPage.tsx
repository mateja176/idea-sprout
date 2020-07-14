import { Box, Tab, Tabs } from '@material-ui/core';
import { Person, Search } from '@material-ui/icons';
import { Ideas, IdeasSkeleton, MyIdeas } from 'containers';
import qs from 'qs';
import React from 'react';
import { RouteComponentProps, useHistory, useLocation } from 'react-router-dom';
import { useSignedInUser } from 'services';

export interface IdeasPageProps extends RouteComponentProps {}

export const IdeasPage: React.FC<IdeasPageProps> = () => {
  const history = useHistory();

  const user = useSignedInUser();

  const query = qs.parse(useLocation().search, { ignoreQueryPrefix: true });

  const showMyIdeas = (query.author && query.author) === user.uid;

  return (
    <Box height={'100%'} display={'flex'} flexDirection={'column'}>
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
          onClick={() => {
            history.push({
              search: qs.stringify({}),
            });
          }}
        />
        <Tab
          label={
            <Box display={'flex'} alignItems={'center'}>
              <Person />
              &nbsp; Your Ideas
            </Box>
          }
          onClick={() => {
            history.push({
              search: qs.stringify({ author: user.uid }),
            });
          }}
        />
      </Tabs>
      <Box flex={1}>
        {showMyIdeas ? (
          <React.Suspense fallback={<IdeasSkeleton />}>
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
