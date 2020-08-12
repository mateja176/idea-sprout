import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Skeleton from '@material-ui/lab/Skeleton';
import { absolutePrivateNavigationRoutes } from 'elements/routes';
import range from 'ramda/es/range';
import React from 'react';

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
