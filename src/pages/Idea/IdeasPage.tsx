import { Box, Tab, Tabs } from '@material-ui/core';
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

  const showMyIdeas = (query.author && query.author) === user?.email;

  const listWrapperRef = React.useRef<HTMLDivElement | null>(null);

  const [listWrapperHeight, setListWrapperHeight] = React.useState<
    React.CSSProperties['height']
  >('auto');

  React.useEffect(() => {
    if (listWrapperRef.current) {
      const { top } = listWrapperRef.current.getBoundingClientRect();

      setListWrapperHeight(window.innerHeight - top);
    }
  }, []);

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
            history.push({
              search: qs.stringify({}),
            });
          }}
        />
        <Tab
          label="Your Ideas"
          onClick={() => {
            history.push({
              search: qs.stringify({ author: user?.email }),
            });
          }}
        />
      </Tabs>
      <div
        ref={listWrapperRef}
        style={{ height: listWrapperHeight, overflow: 'auto' }}
      >
        {showMyIdeas ? (
          <React.Suspense fallback={<IdeasSkeleton />}>
            <MyIdeas user={user} />
          </React.Suspense>
        ) : (
          <React.Suspense fallback={<IdeasSkeleton />}>
            <Ideas user={user} />
          </React.Suspense>
        )}
      </div>
    </Box>
  );
};
