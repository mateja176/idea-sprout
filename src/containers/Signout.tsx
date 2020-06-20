import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  CircularProgress,
} from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';
import React from 'react';
import { useUser } from 'reactfire';
import { createSignout, useActions, selectIsAuthLoading } from 'services';
import { useSelector } from 'react-redux';

export interface SignoutProps {}

export const Signout: React.FC<SignoutProps> = () => {
  const { signOut } = useActions({ signOut: createSignout.request });

  const isAuthLoading = useSelector(selectIsAuthLoading);

  const user = useUser<null>();

  return user ? (
    <Tooltip title={`Sign out of ${user.email}`}>
      <ListItem
        button
        onClick={() => {
          signOut();
        }}
      >
        <ListItemIcon>
          <ExitToApp />
        </ListItemIcon>
        <ListItemText>
          Sign out {isAuthLoading && <CircularProgress size="1em" />}
        </ListItemText>
      </ListItem>
    </Tooltip>
  ) : null;
};
