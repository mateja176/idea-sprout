import { SnackbarProps } from '@material-ui/core/Snackbar';
import { AlertProps } from '@material-ui/lab/Alert';

export interface ISnackbar
  extends Pick<SnackbarProps, 'message' | 'autoHideDuration'>,
    Required<Pick<AlertProps, 'severity'>> {
  message: string;
}

export interface SnackbarState {
  queue: Array<
    Omit<ISnackbar, 'autoHideDuration'> & {
      autoHideDuration: NonNullable<ISnackbar['autoHideDuration']>;
    }
  >;
}
