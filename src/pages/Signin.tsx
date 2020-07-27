import {
  Box,
  Button,
  ButtonGroup,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { useBoolean } from 'ahooks';
import { Google, PageWrapper } from 'components';
import firebase from 'firebase/app';
import 'firebase/auth';
import { random } from 'lodash';
import { quotes } from 'models';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { FacebookIcon, TwitterIcon } from 'react-share';
import { createQueueSnackbar, useActions } from 'services';
import { logoWidth } from 'styles';

export interface SigninProps extends RouteComponentProps {}

const useButtonStyles = makeStyles(() => ({
  label: { textTransform: 'capitalize' },
}));

export const Signin: React.FC<SigninProps> = () => {
  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const theme = useTheme();

  const [loading, setLoading] = useBoolean();

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

  const opacity = loading ? 0.5 : 1;

  const xsAndDown = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <PageWrapper>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box mb={6} display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h2">Sign in with</Typography>

          <Box ml={2} mt={4}>
            <ButtonGroup color="primary" disabled={loading}>
              <Button
                onClick={() => {
                  // auth provider constructors do not yet exist on the auth object returned form useAuth
                  signIn(new firebase.auth.GoogleAuthProvider());
                }}
                classes={buttonClasses}
                startIcon={<Google opacity={opacity} />}
              >
                {!xsAndDown && 'Google'}
              </Button>
              <Button
                onClick={() => {
                  signIn(new firebase.auth.FacebookAuthProvider());
                }}
                classes={buttonClasses}
                startIcon={
                  <FacebookIcon round size={logoWidth} opacity={opacity} />
                }
              >
                {!xsAndDown && 'Facebook'}
              </Button>
              <Button
                onClick={() => {
                  signIn(new firebase.auth.TwitterAuthProvider());
                }}
                classes={buttonClasses}
                startIcon={
                  <TwitterIcon round size={logoWidth} opacity={opacity} />
                }
              >
                {!xsAndDown && 'Twitter'}
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
