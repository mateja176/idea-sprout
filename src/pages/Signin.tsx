import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Facebook, Google, PageWrapper, Twitter } from 'components';
import firebase from 'firebase/app';
import React from 'react';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { createSignin, selectIsAuthLoading, useActions } from 'services';

export interface SigninProps extends RouteComponentProps {}

const useButtonStyles = makeStyles(() => ({
  root: { width: 140 },
  label: { justifyContent: 'flex-start' },
}));

export const Signin: React.FC<SigninProps> = () => {
  const { signIn } = useActions({ signIn: createSignin.request });

  const isAuthLoading = useSelector(selectIsAuthLoading);

  const buttonClasses = useButtonStyles();

  return isAuthLoading ? (
    <Box mt={4} display="flex" justifyContent="center">
      <CircularProgress size="3em" />
    </Box>
  ) : (
    <PageWrapper>
      <Typography variant="h2">Sign in</Typography>

      <Box ml={2} mt={4}>
        <ButtonGroup orientation="vertical" color="primary">
          <Button
            onClick={() => {
              signIn(firebase.auth.GoogleAuthProvider.PROVIDER_ID);
            }}
            classes={buttonClasses}
            startIcon={<Google />}
          >
            Google
          </Button>
          <Button
            onClick={() => {
              signIn(firebase.auth.FacebookAuthProvider.PROVIDER_ID);
            }}
            classes={buttonClasses}
            startIcon={<Facebook />}
          >
            Facebook
          </Button>
          <Button
            onClick={() => {
              signIn(firebase.auth.TwitterAuthProvider.PROVIDER_ID);
            }}
            classes={buttonClasses}
            startIcon={<Twitter />}
          >
            Twitter
          </Button>
        </ButtonGroup>
      </Box>
    </PageWrapper>
  );
};
