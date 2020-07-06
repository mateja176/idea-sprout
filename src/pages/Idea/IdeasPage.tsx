import { Box, Tab, Tabs } from '@material-ui/core';
import { Ideas } from 'containers';
import qs from 'qs';
import React from 'react';
import { RouteComponentProps, useHistory, useLocation } from 'react-router-dom';
import {
  useSignedInUser,
  useActions,
  createSetIdeas,
  createSetCount,
  initialIdeasState,
} from 'services';
import { InfiniteLoader } from 'react-virtualized';

export interface IdeasPageProps extends RouteComponentProps {}

export const IdeasPage: React.FC<IdeasPageProps> = () => {
  const history = useHistory();

  const user = useSignedInUser();

  const query = qs.parse(useLocation().search, { ignoreQueryPrefix: true });

  const showMyIdeas = (query.author && query.author) === user?.email;

  const infiniteLoaderRef = React.useRef<InfiniteLoader | null>(null);

  const { setIdeas, setCount } = useActions({
    setIdeas: createSetIdeas,
    setCount: createSetCount,
  });

  const reset = () => {
    setIdeas({ ideas: [] });
    setCount({ count: initialIdeasState.count });

    infiniteLoaderRef.current?.resetLoadMoreRowsCache();
  };

  return (
    <Box>
      <Tabs
        value={Number(showMyIdeas)}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab
          label="Discover"
          onClick={() => {
            reset();

            history.push({
              search: qs.stringify({}),
            });
          }}
        />
        <Tab
          label="Your Ideas"
          onClick={() => {
            reset();

            history.push({
              search: qs.stringify({ author: user?.email }),
            });
          }}
        />
      </Tabs>
      <Ideas ref={infiniteLoaderRef} showMyIdeas={showMyIdeas} user={user} />
    </Box>
  );
};
