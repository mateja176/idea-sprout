import { createSelector } from 'reselect';
import { State } from '../reducer';

export const selectAuth = ({ auth }: State) => auth;

export const selectIsSignedIn = createSelector(
  [selectAuth],
  ({ user }) =>
    user !== 'initial' && user !== 'loading' && !(user instanceof Error),
);

export const selectIsSignedOut = createSelector(
  [selectAuth],
  ({ user }) => user === 'initial' || user instanceof Error,
);

export const selectIsAuthLoading = createSelector(
  [selectAuth],
  ({ user }) => user === 'loading',
);
