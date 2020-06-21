import { Badge, Snackbar as MaterialSnackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { head } from 'ramda';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  createCloseSnackbar,
  selectSnackbarState,
  useActions,
  useDeferredValue,
} from 'services';

export interface SnackbarProps {}

export const Snackbar: React.FC<SnackbarProps> = () => {
  const { closeSnackbar } = useActions({ closeSnackbar: createCloseSnackbar });

  const { queue } = useSelector(selectSnackbarState);

  const first = head(queue);

  const deferredFirst = useDeferredValue(first, { timeoutMs: 500 });

  const firstWithFallback = { ...deferredFirst, ...first } as typeof first;

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
