import { createSelector } from 'reselect';
import { State } from '../reducer';

export const selectAuth = ({ auth }: State) => auth;

export const selectUser = createSelector([selectAuth], ({ user }) => user);

export const selectIsSignedIn = createSelector(
  [selectUser],
  (user) =>
    user !== 'initial' && user !== 'loading' && !(user instanceof Error),
);

export const selectIsSignedOut = createSelector(
  [selectUser],
  (user) => user === 'initial' || user instanceof Error,
);

export const selectIsAuthLoading = createSelector(
  [selectUser],
  (user) => user === 'loading',
);
