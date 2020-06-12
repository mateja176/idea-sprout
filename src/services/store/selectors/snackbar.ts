import { createSelector } from 'reselect';
import { State } from '../reducer';

export const selectSnackbarState = ({ snackbar }: State) => snackbar;

export const selectSnackbarQueue = createSelector(
  selectSnackbarState,
  ({ queue }) => queue,
);
