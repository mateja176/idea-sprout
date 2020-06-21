import {
  CircularProgress,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';
import React from 'react';
import { useSelector } from 'react-redux';
import { useUser } from 'reactfire';
import { createSignout, selectIsAuthLoading, useActions } from 'services';

export interface SignoutProps {
  onClick: React.MouseEventHandler;
}

export const Signout: React.FC<SignoutProps> = ({ onClick }) => {
  const { signOut } = useActions({ signOut: createSignout.request });

  const isAuthLoading = useSelector(selectIsAuthLoading);

  const user = useUser<null>();

  return user ? (
    <Tooltip title={`Sign out of ${user.email}`}>
      <ListItem
        button
        onClick={(e) => {
          onClick(e);

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
