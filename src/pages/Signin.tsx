import {
  Box,
  Button,
  ButtonGroup,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { useBoolean } from 'ahooks';
import { Facebook, Google, PageWrapper, Twitter } from 'components';
import firebase from 'firebase/app';
import 'firebase/auth';
import { random } from 'lodash';
import { quotes } from 'models';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { createQueueSnackbar, useActions } from 'services';

export interface SigninProps extends RouteComponentProps {}

const useButtonStyles = makeStyles(() => ({
  label: { textTransform: 'capitalize' },
}));

export const Signin: React.FC<SigninProps> = () => {
  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const [loading, setLoading] = useBoolean(false);

  const buttonClasses = useButtonStyles();

  const quote = React.useMemo(() => quotes[random(0, quotes.length - 1)], []);

  const signIn = (provider: firebase.auth.AuthProvider) => {
    setLoading.setTrue();

    return firebase
      .auth()
      .signInWithPopup(provider)
      .catch((error: firebase.FirebaseError) => {
        queueSnackbar({
          severity: 'error',
          message: error.message,
        });
      })
      .finally(() => {
        setLoading.setFalse();
      });
  };

  return (
    <PageWrapper>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box mb={6} display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h2">Sign in</Typography>

          <Box ml={2} mt={4}>
            <ButtonGroup color="primary" disabled={loading}>
              <Button
                onClick={() => {
                  signIn(new firebase.auth.GoogleAuthProvider());
                }}
                classes={buttonClasses}
                startIcon={<Google />}
              >
                Google
              </Button>
              <Button
                onClick={() => {
                  signIn(new firebase.auth.FacebookAuthProvider());
                }}
                classes={buttonClasses}
                startIcon={<Facebook />}
              >
                Facebook
              </Button>
              <Button
                onClick={() => {
                  signIn(new firebase.auth.TwitterAuthProvider());
                }}
                classes={buttonClasses}
                startIcon={<Twitter />}
              >
                Twitter
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
        <Box maxWidth="80vw">
          <Typography
            align="center"
            style={{ opacity: 0.8, fontSize: '2.2rem' }}
          >
            “{quote.message}”
          </Typography>
          <Typography
            align="center"
            style={{ opacity: 0.8, fontSize: '1.8rem', fontStyle: 'italic' }}
          >
            {quote.author}
          </Typography>
        </Box>
      </Box>
    </PageWrapper>
  );
};
