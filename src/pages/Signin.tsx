import {
  Box,
  Button,
  ButtonGroup,
  FormHelperText,
  Grow,
  Link,
  makeStyles,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { Autorenew } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { useBoolean } from 'ahooks';
import { Google, PageWrapper } from 'components';
import firebase, { FirebaseError, User } from 'firebase/app';
import 'firebase/auth';
import { FormikHelpers, useFormik } from 'formik';
import React from 'react';
import { useQuery } from 'react-query';
import { RouteComponentProps } from 'react-router-dom';
import { FacebookIcon, TwitterIcon } from 'react-share';
import { createQueueSnackbar, useActions } from 'services';
import { inputStyle, logoWidth } from 'styles';
import * as yup from 'yup';

export interface SigninProps extends RouteComponentProps {
  user: User | null;
  setUserState: () => void;
}

const linkStyle: React.CSSProperties = {
  cursor: 'pointer',
};

const useButtonStyles = makeStyles(() => ({
  label: { textTransform: 'capitalize' },
}));

const actionCreators = { queueSnackbar: createQueueSnackbar };

const initialValues = {
  email: '',
  password: '',
};
type FormValues = typeof initialValues;

export const Signin: React.FC<SigninProps> = ({ user, setUserState }) => {
  const { queueSnackbar } = useActions(actionCreators);

  const theme = useTheme();

  const [loading, setLoading] = useBoolean();

  const buttonClasses = useButtonStyles();

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

  const sendVerification = React.useCallback(
    () => (user ? user?.sendEmailVerification() : Promise.resolve()),
    [user],
  );
  const sendVerificationQuery = useQuery({
    queryKey: 'sendVerification',
    queryFn: sendVerification,
    config: {
      enabled: false,
      retry: Infinity,
      retryDelay: () => 2000,
    },
  });

  const [signinOrCreateError, setSigninOrCreateError] = React.useState('');

  const reloadUser = React.useCallback(
    () => (user ? user.reload().then(setUserState) : Promise.resolve()),
    [user, setUserState],
  );
  useQuery({
    queryKey: 'reloadUser',
    queryFn: reloadUser,
    config: {
      enabled: !!user,
      retry: Infinity,
      retryDelay: () => 2000,
      refetchInterval: 2000,
    },
  });

  const validationSchema = yup
    .object()
    .required()
    .shape<FormValues>({
      email: yup.string().required().email(),
      password: yup.string().required().min(6),
    });

  const [activeTab, setActiveTab] = React.useState(0);

  const signInWithEmail = React.useCallback(
    ({ email, password }: FormValues) =>
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((credential) => {
          if (!credential.user?.emailVerified) {
            sendVerificationQuery.refetch();
          }
        }),
    [sendVerificationQuery],
  );

  const createUser = React.useCallback(
    (formValues: FormValues) => {
      const { email, password } = formValues;
      return firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => signInWithEmail(formValues)); // https://stackoverflow.com/questions/37431128/firebase-confirmation-email-not-being-sent
    },
    [signInWithEmail],
  );

  const resetErrors = React.useCallback(() => {
    setSigninOrCreateError('');
  }, []);

  const onSubmit = React.useCallback(
    (
      formValues: FormValues,
      { resetForm, setTouched }: FormikHelpers<FormValues>,
    ) => {
      resetErrors();
      const handleSuccess = () => {
        setTouched({});
        resetForm();
      };
      const handleError = (error: FirebaseError) => {
        setSigninOrCreateError(error.message);
      };
      if (activeTab === 0) {
        return signInWithEmail(formValues)
          .then(handleSuccess)
          .catch(handleError);
      } else {
        return createUser(formValues)
          .then(handleSuccess)
          .catch((error: FirebaseError) => {
            setSigninOrCreateError(error.message);
          });
      }
    },
    [activeTab, signInWithEmail, createUser, resetErrors],
  );

  const {
    getFieldProps,
    handleSubmit,
    errors,
    touched,
    isSubmitting,
    resetForm,
  } = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const handleCloseSigninError = React.useCallback(() => {
    setSigninOrCreateError('');
  }, []);

  const [signingOut, setSigningOut] = useBoolean();
  const handleTabChange: React.ComponentProps<
    typeof Tabs
  >['onChange'] = React.useCallback(
    (e, value) => {
      if (user) {
        setSigningOut.setTrue();
        firebase
          .auth()
          .signOut()
          .then(() => {
            setActiveTab(value);
            resetForm();
            resetErrors();
          })
          .finally(setSigningOut.setFalse);
      } else {
        setActiveTab(value);
        resetForm();
        resetErrors();
      }
    },
    [resetForm, resetErrors, user, setSigningOut],
  );

  const handleSendVerification = React.useCallback(() => {
    sendVerificationQuery.refetch();
  }, [sendVerificationQuery]);

  const notVerifiedEmail = !!user && !user.emailVerified;

  const resendIconRef = React.useRef<SVGSVGElement | null>(null);
  React.useEffect(() => {
    const animation = sendVerificationQuery.isLoading
      ? resendIconRef.current?.animate(
          [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
          { duration: 1000, iterations: Infinity, easing: 'ease-in-out' },
        )
      : undefined;
    return () => {
      animation?.cancel();
    };
  }, [sendVerificationQuery.isLoading]);

  const handleReset = React.useCallback(() => {
    firebase.auth().signOut();
  }, []);

  return (
    <PageWrapper mt={0}>
      <Tabs variant={'fullWidth'} value={activeTab} onChange={handleTabChange}>
        <Tab disabled={signingOut} label={'Sign in'} />
        <Tab disabled={signingOut} label={'Register'} />
      </Tabs>
      <Box mt={2} display="flex" flexDirection="column" alignItems="center">
        <Box display="flex" flexDirection="column" alignItems="center">
          <Grow in={!!signinOrCreateError || notVerifiedEmail}>
            <Box mb={2}>
              {(() => {
                switch (true) {
                  case !!signinOrCreateError:
                    return (
                      <Alert
                        severity={'error'}
                        onClose={handleCloseSigninError}
                      >
                        {signinOrCreateError}
                      </Alert>
                    );
                  case notVerifiedEmail:
                    return (
                      <Alert severity={'success'}>
                        An email has been sent to {user?.email}. In case you
                        want a different email,{' '}
                        <Link style={linkStyle} onClick={handleReset}>
                          reset here
                        </Link>
                        .
                      </Alert>
                    );
                }
              })()}
            </Box>
          </Grow>
          <Box mb={3}>
            <form onSubmit={handleSubmit}>
              <TextField
                {...getFieldProps('email')}
                label={'Email'}
                error={touched.email && !!errors.email}
                helperText={(touched.email || '') && errors.email}
                variant={'outlined'}
                style={inputStyle}
              />
              <TextField
                {...getFieldProps('password')}
                type={'password'}
                label={'Password'}
                error={touched.password && !!errors.password}
                helperText={(touched.password || '') && errors.password}
                variant={'outlined'}
                style={inputStyle}
              />
              <Button
                type={'submit'}
                disabled={isSubmitting}
                variant={'contained'}
                color={'primary'}
              >
                {activeTab === 0 ? 'Sign in' : 'Register'}
              </Button>
            </form>
          </Box>
          <Grow mountOnEnter unmountOnExit in={notVerifiedEmail}>
            <Box
              display={'flex'}
              flexDirection={'column'}
              alignItems={'center'}
            >
              <Box mt={2} mb={2}>
                <FormHelperText>
                  Didn't receive email? Resend to {user?.email}.
                </FormHelperText>
              </Box>
              <Button
                disabled={sendVerificationQuery.isLoading}
                variant={'contained'}
                onClick={handleSendVerification}
                startIcon={<Autorenew ref={resendIconRef} />}
              >
                Resend email
              </Button>
            </Box>
          </Grow>
          <Box mt={3} mb={2}>
            <Typography>Or sign in with</Typography>
          </Box>
          <Box ml={2}>
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
      </Box>
    </PageWrapper>
  );
};
