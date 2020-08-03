import { ISnackbar, SnackbarState } from 'models';
import { createContext } from 'react';

export interface ISnackbarContext {
  queue: SnackbarState['queue'];
  queueSnackbar: (snackbar: ISnackbar) => void;
  closeSnackbar: () => void;
}

export const initialSnackbarContext: ISnackbarContext = {
  queue: [],
  queueSnackbar: () => {},
  closeSnackbar: () => {},
};

export const SnackbarContext = createContext(initialSnackbarContext);
