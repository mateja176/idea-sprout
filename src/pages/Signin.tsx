import {
  Box,
  Button,
  ButtonGroup,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Facebook, Google, PageWrapper, Twitter } from 'components';
import firebase from 'firebase/app';
import { random } from 'lodash';
import { quotes } from 'models';
import React from 'react';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { createSignin, selectIsAuthLoading, useActions } from 'services';

export interface SigninProps extends RouteComponentProps {}

const useButtonStyles = makeStyles(() => ({
  label: { textTransform: 'capitalize' },
}));

export const Signin: React.FC<SigninProps> = () => {
  const { signIn } = useActions({ signIn: createSignin.request });

  const isAuthLoading = useSelector(selectIsAuthLoading);

  const buttonClasses = useButtonStyles();

  const quote = React.useMemo(() => quotes[random(0, quotes.length - 1)], []);

  return (
    <PageWrapper>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box mb={6} display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h2">Sign in</Typography>

          <Box ml={2} mt={4}>
            <ButtonGroup color="primary" disabled={isAuthLoading}>
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
