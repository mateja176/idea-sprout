import { Box, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Load } from 'components';
import React from 'react';
import { IdeasSkeleton } from './IdeasSkeleton';
import { LibraryAdd } from '@material-ui/icons';

export const MyIdeasSkeleton: React.FC = () => (
  <Box height={'100%'} display={'flex'} flexDirection={'column'}>
    <Load>
      <ListItem>
        <ListItemIcon>
          <LibraryAdd />
        </ListItemIcon>
        <ListItemText>Create</ListItemText>
      </ListItem>
    </Load>
    <Box flex={1}>
      <IdeasSkeleton />
    </Box>
  </Box>
);
