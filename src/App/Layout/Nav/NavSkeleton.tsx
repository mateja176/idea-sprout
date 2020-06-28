import {
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { range } from 'ramda';
import React from 'react';
import { absolutePrivateNavigationRoutes } from 'utils';

export interface NavSkeletonProps {}

export const NavSkeleton: React.FC<NavSkeletonProps> = () => (
  <List>
    {range(0, absolutePrivateNavigationRoutes.length + 1).map(() => (
      <ListItem>
        <ListItemIcon>
          <Icon>
            <Skeleton variant={'circle'} width={'100%'} height={'100%'} />
          </Icon>
        </ListItemIcon>
        <ListItemText>
          <Skeleton variant={'text'} />
        </ListItemText>
      </ListItem>
    ))}
  </List>
);
