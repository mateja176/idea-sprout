import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React from 'react';
import { Load } from '../../../../components/Load';
import { IdeasSkeleton } from '../../../../containers/Idea/Ideas/IdeasSkeleton';

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
