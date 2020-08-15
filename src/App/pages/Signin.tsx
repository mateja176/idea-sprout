import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grow from '@material-ui/core/Grow';
import Link from '@material-ui/core/Link';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Autorenew from '@material-ui/icons/Autorenew';
import Alert from '@material-ui/lab/Alert';
import useBoolean from 'ahooks/es/useBoolean';
import { Google } from 'components/icons/Google';
import { PageWrapper } from 'components/PageWrapper';
import { SnackbarContext } from 'context/snackbar';
import firebase, { FirebaseError, User } from 'firebase/app';
import { FormikHelpers, useFormik } from 'formik';
import { useActions } from 'hooks/hooks';
import { passwordSchema } from 'models/auth';
import React from 'react';
import { useQuery } from 'react-query';
import FacebookIcon from 'react-share/es/FacebookIcon';
import TwitterIcon from 'react-share/es/TwitterIcon';
import { blur } from 'services/services';
import {
  createSaveUser,
  createSetEmailVerified,
} from 'services/store/slices/auth';
import { inputStyle, logoWidth } from 'utils/styles/styles';
import * as yup from 'yup';

export interface SigninProps {
  user: User | null;
  auth: firebase.auth.Auth;
}

const linkStyle: React.CSSProperties = {
  cursor: 'pointer',
};

const alignCenterStyle: React.CSSProperties = {
  textAlign: 'center',
};

const useButtonStyles = makeStyles(() => ({
  label: { textTransform: 'capitalize' },
}));

const initialValues = {
  email: '',
  password: '',
};
type FormValues = typeof initialValues;

const actionCreators = {
  saveUser: createSaveUser.request,
  setEmailVerified: createSetEmailVerified,
};

const Signin: React.FC<SigninProps> = ({ user, auth }) => {
  const { saveUser, setEmailVerified } = useActions(actionCreators);
  const saveUserCredential = React.useCallback(
    (credential: firebase.auth.UserCredential) => {
      if (credential.user) {
        saveUser(credential.user);
      }
    },
    [saveUser],
  );

  const { queueSnackbar } = React.useContext(SnackbarContext);

  const [loading, setLoading] = useBoolean();

  const buttonClasses = useButtonStyles();

  const signIn = React.useCallback(
    (provider: firebase.auth.AuthProvider) => {
      setLoading.setTrue();

      return auth
        .signInWithPopup(provider)
        .then(saveUserCredential)
        .catch((error: firebase.FirebaseError) => {
          queueSnackbar({
            severity: 'error',
            message: error.message,
          });
        })
        .finally(() => {
          setLoading.setFalse();
        });
    },
    [setLoading, queueSnackbar, auth, saveUserCredential],
  );

  const opacity = loading ? 0.5 : 1;

  const xsAndDown = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('xs'),
  );

  const resendIconRef = React.useRef<SVGSVGElement | null>(null);

  const [signinOrCreateError, setSigninOrCreateError] = React.useState('');

  const sendVerification = React.useCallback(() => {
    if (user) {
      const animation = resendIconRef.current?.animate(
        [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
        { duration: 1000, iterations: Infinity, easing: 'ease-in-out' },
      );

      return user
        ?.sendEmailVerification()
        .catch((error: FirebaseError) => {
          console.log(error);
          setSigninOrCreateError(error.message);
        })
        .finally(() => {
          animation?.cancel();
        });
    } else {
      return Promise.resolve();
    }
  }, [user]);
  const sendVerificationParams = React.useMemo(
    () => ({
      queryKey: 'sendVerification',
      queryFn: sendVerification,
      config: {
        enabled: false,
      },
    }),
    [sendVerification],
  );
  const sendVerificationQuery = useQuery(sendVerificationParams);

  const reloadUser = React.useCallback(
    () =>
      user
        ? user.reload().then(() => {
            if (user.emailVerified) {
              setEmailVerified(true);

              queueSnackbar({
                severity: 'success',
                message: 'Discover ideas or create and publish your own',
              });
            }
          })
        : Promise.resolve(),
    [user, queueSnackbar, setEmailVerified],
  );
  const reloadUserParams = React.useMemo(
    () => ({
      queryKey: 'reloadUser',
      queryFn: reloadUser,
      config: {
        enabled: !!user,
        retry: Infinity,
        retryDelay: () => 2000,
        refetchInterval: 2000,
      },
    }),
    [user, reloadUser],
  );
  useQuery(reloadUserParams);

  const validationSchema = yup.object().required().shape<FormValues>({
    email: yup.string().required().email(),
    password: passwordSchema,
  });

  const [activeTab, setActiveTab] = React.useState(0);

  const signInWithEmail = React.useCallback(
    ({ email, password }: FormValues) =>
      auth
        .signInWithEmailAndPassword(email, password)
        .then((credential) => {
          if (credential.user?.emailVerified) {
            return credential;
          } else {
            return sendVerificationQuery.refetch().then(() => credential);
          }
        })
        .then(saveUserCredential),
    [sendVerificationQuery, auth, saveUserCredential],
  );

  const createUser = React.useCallback(
    (formValues: FormValues) => {
      const { email, password } = formValues;
      return auth
        .createUserWithEmailAndPassword(email, password)
        .then(() => signInWithEmail(formValues));
    },
    [signInWithEmail, auth],
  );

  const resetErrors = React.useCallback(() => {
    setSigninOrCreateError('');
  }, []);

  const onSubmit = React.useCallback(
    (formValues: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
      resetErrors();
      const handleSuccess = () => {
        blur();

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
        auth
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
    [resetForm, resetErrors, user, setSigningOut, auth],
  );

  const handleSendVerification = React.useCallback(() => {
    sendVerificationQuery.refetch();
  }, [sendVerificationQuery]);

  const notVerifiedEmail = !!user && !user.emailVerified;

  const handleReset = React.useCallback(() => {
    auth.signOut();
  }, [auth]);

  const emailHelperText = React.useMemo(
    () => (touched.email || '') && errors.email,
    [touched, errors],
  );

  const passwordHelperText = React.useMemo(
    () => (touched.password || '') && errors.password,
    [touched, errors],
  );

  const handleGoogleSignin: React.MouseEventHandler = React.useCallback(() => {
    // auth provider constructors do not yet exist on the auth object returned form useAuth
    signIn(new firebase.auth.GoogleAuthProvider());
  }, [signIn]);

  const handleFacebookSignin: React.MouseEventHandler = React.useCallback(() => {
    signIn(new firebase.auth.FacebookAuthProvider());
  }, [signIn]);

  const handleTwitterSignin: React.MouseEventHandler = React.useCallback(() => {
    signIn(new firebase.auth.TwitterAuthProvider());
  }, [signIn]);

  return (
    <>
      <Tabs variant={'fullWidth'} value={activeTab} onChange={handleTabChange}>
        <Tab disabled={signingOut} label={'Sign in'} />
        <Tab disabled={signingOut} label={'Register'} />
      </Tabs>
      <PageWrapper
        mt={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box mb={2}>
            {(() => {
              switch (true) {
                case !!signinOrCreateError:
                  return (
                    <Alert severity={'error'} onClose={handleCloseSigninError}>
                      {signinOrCreateError}
                    </Alert>
                  );
                case notVerifiedEmail:
                  return (
                    <Alert severity={'success'}>
                      An email has been sent to {user?.email}. In case you want
                      a different email,{' '}
                      <Link style={linkStyle} onClick={handleReset}>
                        resend here
                      </Link>
                      .
                    </Alert>
                  );
                default:
                  return (
                    <Alert severity={'info'}>
                      {activeTab === 0 ? 'Sign in' : 'Register'} to discover,
                      create and share ideas.
                    </Alert>
                  );
              }
            })()}
          </Box>
          <Box mb={3}>
            <form onSubmit={handleSubmit}>
              <TextField
                {...getFieldProps('email')}
                label={'Email'}
                error={touched.email && !!errors.email}
                helperText={emailHelperText}
                variant={'outlined'}
                style={inputStyle}
              />
              <TextField
                {...getFieldProps('password')}
                type={'password'}
                label={'Password'}
                error={touched.password && !!errors.password}
                helperText={passwordHelperText}
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
                <FormHelperText style={alignCenterStyle}>
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
                onClick={handleGoogleSignin}
                classes={buttonClasses}
                startIcon={<Google opacity={opacity} />}
                aria-label={'Google'}
              >
                {!xsAndDown && 'Google'}
              </Button>
              <Button
                onClick={handleFacebookSignin}
                classes={buttonClasses}
                startIcon={
                  <FacebookIcon round size={logoWidth} opacity={opacity} />
                }
                aria-label={'Facebook'}
              >
                {!xsAndDown && 'Facebook'}
              </Button>
              <Button
                onClick={handleTwitterSignin}
                classes={buttonClasses}
                startIcon={
                  <TwitterIcon round size={logoWidth} opacity={opacity} />
                }
                aria-label={'Twitter'}
              >
                {!xsAndDown && 'Twitter'}
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
      </PageWrapper>
    </>
  );
};

export default Signin;
