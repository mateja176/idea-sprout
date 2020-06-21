import { SnackbarProps } from '@material-ui/core';
import { AlertProps } from '@material-ui/lab';

export type AsyncState<State> = 'initial' | 'loading' | Error | State;

export interface ISnackbar
  extends Pick<SnackbarProps, 'message' | 'autoHideDuration'>,
    Pick<AlertProps, 'severity'> {
  message: string;
}

export interface WithTimeout {
  timeoutMs: number;
}
