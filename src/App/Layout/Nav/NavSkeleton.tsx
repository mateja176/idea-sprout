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

export const NavItemSkeleton: React.FC = () => (
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
);

export interface NavSkeletonProps {}

export const NavSkeleton: React.FC<NavSkeletonProps> = () => (
  <List>
    {range(0, absolutePrivateNavigationRoutes.length + 2).map((i) => (
      <NavItemSkeleton key={i} />
    ))}
  </List>
);
