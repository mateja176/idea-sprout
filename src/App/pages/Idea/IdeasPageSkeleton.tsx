import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { Load } from 'components/Load';
import { IdeasSkeleton } from 'containers/Idea/Ideas/IdeasSkeleton';
import React from 'react';

export const IdeasPageSkeleton = () => (
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
