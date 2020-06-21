import { Badge, Snackbar as MaterialSnackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { head } from 'ramda';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  createCloseSnackbar,
  selectSnackbarQueue,
  useActions,
  useValueWithFallback,
} from 'services';

export interface SnackbarProps {}

export const Snackbar: React.FC<SnackbarProps> = () => {
  const { closeSnackbar } = useActions({ closeSnackbar: createCloseSnackbar });

  const queue = useSelector(selectSnackbarQueue);

  const first = head(queue);

  const firstWithFallback = useValueWithFallback(first, { timeoutMs: 500 });

  return (
    <MaterialSnackbar
      open={!!first}
      autoHideDuration={first?.autoHideDuration}
      onClose={closeSnackbar}
    >
      <Badge badgeContent={queue.length} color="primary">
        <Alert severity={firstWithFallback?.severity} onClose={closeSnackbar}>
          {firstWithFallback?.message}
        </Alert>
      </Badge>
    </MaterialSnackbar>
  );
};
