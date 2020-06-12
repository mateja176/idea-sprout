import { Snackbar as MaterialSnackbar, Badge } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { useSelector } from 'react-redux';
import { createCloseSnackbar, selectSnackbarState, useActions } from 'services';

export interface SnackbarProps {}

export const Snackbar: React.FC<SnackbarProps> = () => {
  const { closeSnackbar } = useActions({ closeSnackbar: createCloseSnackbar });

  const { queue } = useSelector(selectSnackbarState);

  const [first] = queue;

  return first ? (
    <MaterialSnackbar
      open
      autoHideDuration={first.autoHideDuration || 5000}
      onClose={closeSnackbar}
    >
      <Badge badgeContent={queue.length} color="primary">
        <Alert severity={first.severity} onClose={closeSnackbar}>
          {first.message}
        </Alert>
      </Badge>
    </MaterialSnackbar>
  ) : null;
};
