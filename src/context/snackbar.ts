import { createContext } from 'react';
import { ISnackbar, SnackbarState } from '../models/snackbar';

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
