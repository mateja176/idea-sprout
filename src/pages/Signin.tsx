import {
  Box,
  Button,
  ButtonGroup,
  FormHelperText,
  Grow,
  makeStyles,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useBoolean } from 'ahooks';
import { Google, PageWrapper } from 'components';
import firebase, { FirebaseError, User } from 'firebase/app';
import 'firebase/auth';
import { FormikHelpers, useFormik } from 'formik';
import { equals } from 'ramda';
import React from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { FacebookIcon, TwitterIcon } from 'react-share';
import { createQueueSnackbar, useActions, useUser } from 'services';
import { inputStyle, logoWidth } from 'styles';
import * as yup from 'yup';

export interface SigninProps extends RouteComponentProps {}

const useButtonStyles = makeStyles(() => ({
  label: { textTransform: 'capitalize' },
}));

const actionCreators = { queueSnackbar: createQueueSnackbar };

const initialValues = {
  email: '',
  password: '',
};
type FormValues = typeof initialValues;

export const Signin: React.FC<SigninProps> = () => {
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

  const history = useHistory();

  const user = useUser<User>();

  const sendVerification = React.useCallback(
    () =>
      user?.sendEmailVerification().catch((error: FirebaseError) => {
        setSendVerificationError(error.message);
      }),
    [user],
  );

  const [submitCount, setSubmitCount] = React.useState(0);

  const [signinOrCreateError, setSigninOrCreateError] = React.useState('');
  const [confirmationError, setConfirmationError] = React.useState('');
  const [sendVerificationError, setSendVerificationError] = React.useState('');
  const [reloadUserError, setReloadUserError] = React.useState('');

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
      firebase.auth().signInWithEmailAndPassword(email, password),
    [],
  );

  const createUser = React.useCallback(
    ({ email, password }: FormValues) =>
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(sendVerification),
    [sendVerification],
  );

  const resetErrors = React.useCallback(() => {
    setSigninOrCreateError('');
    setConfirmationError('');
    setSendVerificationError('');
    setReloadUserError('');
  }, []);

  const onSubmit = React.useCallback(
    (formValues: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
      resetErrors();
      const handleSuccess = () => {
        resetForm();
        setSubmitCount((count) => count + 1);
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
    values,
  } = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const handleCloseSigninError = React.useCallback(() => {
    setSigninOrCreateError('');
  }, []);

  const handleTabChange: React.ComponentProps<
    typeof Tabs
  >['onChange'] = React.useCallback(
    (e, value) => {
      setActiveTab(value);
      resetForm();
      resetErrors();
      setSubmitCount(0);
    },
    [resetForm, resetErrors],
  );

  const successfullySubmitted =
    submitCount > 0 && equals(values, initialValues);

  const [sendingVerification, setSendingVerification] = useBoolean();

  const resendVerification = React.useCallback(() => {
    setSendingVerification.setTrue();
    sendVerification()?.finally(setSendingVerification.setFalse);
  }, [sendVerification, setSendingVerification]);

  const [reloadingUser, setReloadingUser] = useBoolean();

  const reload = React.useCallback(() => {
    setReloadingUser.setTrue();
    user
      ?.reload()
      .then(() => {
        setConfirmationError(
          `Visit inbox of ${user?.email}, find the verification email and click on the link. If you can't find the email, check the spam folder or resend the verification email.`,
        );
        history.go(0);
      })
      .catch((error: FirebaseError) => {
        setReloadUserError(error.message);
      })
      .finally(setReloadingUser.setFalse);
  }, [user, history, setReloadingUser]);

  React.useEffect(() => {
    if (reloadUserError) {
      setTimeout(() => {
        reload();
      }, 1000);
    }
  }, [reload, reloadUserError]);

  return (
    <PageWrapper>
      <Tabs variant={'fullWidth'} value={activeTab} onChange={handleTabChange}>
        <Tab label={'Sign in'} />
        <Tab label={'Register'} />
      </Tabs>
      <Box mt={2} display="flex" flexDirection="column" alignItems="center">
        <Box display="flex" flexDirection="column" alignItems="center">
          <Grow
            in={
              !!(
                signinOrCreateError ||
                successfullySubmitted ||
                confirmationError
              )
            }
          >
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
                  case !!confirmationError:
                    return (
                      <Alert severity={'error'}>{confirmationError}</Alert>
                    );
                  case successfullySubmitted:
                    return (
                      <Alert severity={'success'}>
                        An email has been sent to {user?.email}. To verify your
                        email click on the link.
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
          <Grow
            mountOnEnter
            in={!!(sendVerificationError || successfullySubmitted)}
          >
            <Box
              display={'flex'}
              flexDirection={'column'}
              alignItems={'center'}
            >
              <Box mb={2}>
                <FormHelperText>
                  Have you confirmed your email by clicking on the link?
                </FormHelperText>
              </Box>
              <Button
                disabled={reloadingUser || !!reloadUserError}
                variant={'contained'}
                color={'secondary'}
                onClick={reload}
              >
                Yes
              </Button>

              <Box mt={2} mb={2}>
                <FormHelperText>
                  {sendVerificationError ||
                    `Didn't receive email? Resend to ${user?.email}.`}
                </FormHelperText>
              </Box>
              <Button
                disabled={isSubmitting || sendingVerification}
                variant={'contained'}
                onClick={resendVerification}
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
