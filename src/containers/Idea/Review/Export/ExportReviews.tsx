import Backdrop from '@material-ui/core/Backdrop';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Tab, { TabProps } from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Beenhere from '@material-ui/icons/Beenhere';
import CloudDownload from '@material-ui/icons/CloudDownload';
import EmojiEvents from '@material-ui/icons/EmojiEvents';
import Alert from '@material-ui/lab/Alert';
import Skeleton from '@material-ui/lab/Skeleton';
import useBoolean from 'ahooks/es/useBoolean';
import { AuthCheck } from 'containers/AuthCheck';
import { ProMembership } from 'containers/ProMembership';
import { SnackbarContext } from 'context';
import { proMembership, proMembershipDiscount } from 'elements';
import firebase, { FirebaseError, User } from 'firebase/app';
import { useFormik } from 'formik';
import jsonexport from 'jsonexport/dist';
import kebabCase from 'lodash/kebabCase';
import {
  claims,
  FirestoreUser,
  IdeaModel,
  passwordSchema,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Provider,
  ProviderId,
  Review,
  ReviewWithAuthor,
} from 'models';
import React from 'react';
import { env } from 'services/env';
import { formatCurrency } from 'services/format';
import { useReviewsRef, useUpgradeToPro, useUsersRef } from 'services/hooks';
import {
  inputStyle,
  paypalButtonsHeight,
  paypalHeightBreakpoint,
  tabChildStyle,
} from 'styles';
import { paypal } from 'types';
import { convertFirestoreCollection, convertFirestoreDocument } from 'utils';
import * as yup from 'yup';

const id = 'paypal-container';

const scriptId = 'paypal-script';

const dialogContentStyle: React.CSSProperties = { overflowY: 'auto' };

const originalPriceStyle: React.CSSProperties = {
  textDecoration: 'line-through',
};

const initialValues = {
  password: '',
};
type FormValues = typeof initialValues;

const validationSchema = yup.object().required().shape<FormValues>({
  password: passwordSchema,
});

const useStyles = makeStyles((theme) => ({
  paypalButtonsHeight: {
    display: 'flex',
    justifyContent: 'center',
    height: paypalButtonsHeight[116],
    [theme.breakpoints.up(paypalHeightBreakpoint[400])]: {
      height: paypalButtonsHeight[142],
    },
    [theme.breakpoints.up(paypalHeightBreakpoint[600])]: {
      height: paypalButtonsHeight[168],
    },
  },
  backdrop: {
    // * covers paypal buttons
    zIndex: 1000,
  },
}));

export const ExportReviews: React.FC<
  { idea: IdeaModel; user: User } & Pick<TabProps, 'classes' | 'style'>
> = ({ idea, user, ...props }) => {
  const { queueSnackbar } = React.useContext(SnackbarContext);

  const upgradeToPro = useUpgradeToPro();

  const isAuthor = idea.author === user.uid;

  const reviewsRef = useReviewsRef(idea.id);

  const usersRef = useUsersRef();

  const classes = useStyles();

  const [loading, setLoading] = useBoolean();

  const getReviews = React.useCallback(
    () =>
      reviewsRef.get().catch(
        () =>
          new Promise<firebase.firestore.QuerySnapshot>((resolve) => {
            setTimeout(() => {
              getReviews().then(resolve);
            }, 2000);
          }),
      ),
    [reviewsRef],
  );

  const exportReviews = React.useCallback(() => {
    setLoading.setTrue();

    getReviews()
      .then((collection) => convertFirestoreCollection<Review>(collection))
      .then((reviews) =>
        Promise.all(
          reviews.map(({ id, rating, feedback }) => {
            const userRef = usersRef.doc(id);

            const getUser = () =>
              userRef.get().catch(
                () =>
                  new Promise<firebase.firestore.DocumentSnapshot>(
                    (resolve) => {
                      setTimeout(() => {
                        getUser().then(resolve);
                      }, 2000);
                    },
                  ),
              );

            return getUser()
              .then((doc) => convertFirestoreDocument<FirestoreUser>(doc))
              .then(({ displayName, email }) => {
                const [firstName, lastName] = displayName?.split(' ') || [];
                return {
                  rating,
                  feedback,
                  firstName,
                  lastName,
                  email,
                } as ReviewWithAuthor;
              });
          }),
        ),
      )
      .then((reviews) => jsonexport(reviews))
      .then((csv) => {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${kebabCase(idea.name)}_reviews.csv`;

        document.body.appendChild(a);

        a.click();

        URL.revokeObjectURL(url);
        a.remove();
      })
      .finally(() => {
        setLoading.setFalse();
      });
  }, [usersRef, idea, setLoading, getReviews]);

  const [upgradeDialogOpen, setUpgradeDialogOpen] = useBoolean(false);

  const [scriptLoading, setScriptLoading] = useBoolean();

  const [approving, setApproving] = useBoolean();

  const close = React.useCallback(() => {
    queueSnackbar({
      severity: 'success',
      message: 'Welcome to the pros!',
    });
    setApproving.setFalse();
    setUpgradeDialogOpen.setFalse();
  }, [queueSnackbar, setApproving, setUpgradeDialogOpen]);

  const [passwordDialogOpen, setPasswordDialogOpen] = useBoolean();
  const [passwordError, setPasswordError] = React.useState('');

  const {
    handleSubmit,
    getFieldProps,
    touched,
    errors,
    isSubmitting,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: ({ password }, { resetForm }) => {
      const reauthenticate = (password: string) => {
        if (user.email) {
          const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            password,
          );
          return user
            .reauthenticateAndRetrieveDataWithCredential(credential)
            .then(() => {
              setPasswordDialogOpen.setFalse();
              close();
            })
            .catch((error: FirebaseError) => {
              resetForm();
              setPasswordError(error.message);
            });
        } else {
          console.error(
            'The providerId is "password" but the user has no email.',
          );
        }
      };

      return reauthenticate(password);
    },
  });

  const upgrade: typeof upgradeToPro = React.useCallback(
    ({ orderId: id }) =>
      upgradeToPro({ orderId: id }).catch(
        () =>
          new Promise<firebase.functions.HttpsCallableResult>((resolve) => {
            setTimeout(() => {
              upgrade({ orderId: id }).then(resolve);
            }, 2000);
          }),
      ),
    [upgradeToPro],
  );

  const reauthenticateWithPopup = React.useCallback(
    (Provider: Provider) =>
      user.reauthenticateWithPopup(new Provider()).catch(
        () =>
          new Promise<firebase.auth.UserCredential>((resolve) => {
            setTimeout(() => {
              reauthenticateWithPopup(Provider).then(resolve);
            }, 2000);
          }),
      ),
    [user],
  );

  const renderButtons = React.useCallback(() => {
    window.paypal
      ?.Buttons({
        createOrder: (_, actions) =>
          actions.order.create({
            purchase_units: [
              {
                description: 'Pro membership',
                amount: {
                  value: proMembershipDiscount.amount.value,
                },
              },
            ],
          }),
        onApprove: (_, actions) => {
          setApproving.setTrue();

          const capture = () =>
            actions.order.capture().catch(
              () =>
                new Promise<paypal.Order>((resolve) => {
                  setTimeout(() => {
                    capture().then(resolve);
                  }, 2000);
                }),
            );

          return capture().then(({ id }) =>
            upgrade({ orderId: id }).then(() => {
              const [provider] = user.providerData;
              if (provider) {
                const providerId = provider.providerId as ProviderId;
                if (providerId === 'password') {
                  setPasswordDialogOpen.setTrue();
                } else {
                  const CurrentProvider = [
                    firebase.auth.GoogleAuthProvider,
                    firebase.auth.FacebookAuthProvider,
                    firebase.auth.TwitterAuthProvider,
                  ].find((provider) => provider.PROVIDER_ID === providerId);
                  if (CurrentProvider) {
                    return reauthenticateWithPopup(CurrentProvider).then(close);
                  } else {
                    console.error('Unknown provider id', providerId);
                  }
                }
              } else {
                console.error('No provider found for user', user);
              }
            }),
          );
        },
      })
      .render(`#${id}`);
  }, [
    upgrade,
    user,
    close,
    setPasswordDialogOpen,
    setApproving,
    reauthenticateWithPopup,
  ]);

  const loadScript = React.useCallback(() => {
    setScriptLoading.setTrue();

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${env.paypalClientId}`;
    script.id = scriptId;

    script.addEventListener('load', () => {
      setScriptLoading.setFalse();

      renderButtons();
    });

    document.body.appendChild(script);
  }, [renderButtons, setScriptLoading]);

  const openUpgradeDialog = React.useCallback(() => {
    setUpgradeDialogOpen.setTrue();
  }, [setUpgradeDialogOpen]);

  const becomeAPro = (
    <Tooltip title={'Become a Pro'}>
      <Box style={tabChildStyle} onClick={openUpgradeDialog}>
        <EmojiEvents color={'secondary'} />
      </Box>
    </Tooltip>
  );

  const handleEntered = React.useCallback(() => {
    if (document.getElementById(scriptId)) {
      renderButtons();
    } else {
      loadScript();
    }
  }, [renderButtons, loadScript]);

  const passwordHelperText = React.useMemo(
    () => (touched.password || '') && errors.password,
    [touched, errors],
  );

  return (
    <>
      <Tab
        {...props}
        disabled={loading}
        label={
          <AuthCheck
            requiredClaims={claims.pro}
            fallback={
              isAuthor ? (
                <Tooltip title={'Export reviews'}>
                  <Box style={tabChildStyle} onClick={openUpgradeDialog}>
                    <CloudDownload color={'secondary'} />
                  </Box>
                </Tooltip>
              ) : (
                <React.Suspense
                  fallback={
                    <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
                  }
                >
                  <ProMembership
                    uid={user.uid}
                    upgrade={openUpgradeDialog}
                    becomeAPro={becomeAPro}
                  />
                </React.Suspense>
              )
            }
            aria-label={'Export Reviews'}
          >
            {isAuthor ? (
              <Tooltip title={'Export reviews'}>
                <Box style={tabChildStyle} onClick={exportReviews}>
                  <CloudDownload color={'secondary'} />
                </Box>
              </Tooltip>
            ) : (
              <Tooltip title={"You're lifetime a pro"}>
                <Box style={tabChildStyle}>
                  <Beenhere color={'primary'} />
                </Box>
              </Tooltip>
            )}
          </AuthCheck>
        }
      />
      <Dialog open={upgradeDialogOpen} fullScreen onEntered={handleEntered}>
        <DialogTitle>
          Become a Pro:{' '}
          <span style={originalPriceStyle}>
            {formatCurrency(proMembership.amount.value)}
          </span>{' '}
          <span>{formatCurrency(proMembershipDiscount.amount.value)}</span>
        </DialogTitle>
        <DialogContent style={dialogContentStyle}>
          <Box textAlign={'justify'} position={'relative'}>
            <Backdrop open={approving} className={classes.backdrop}>
              <CircularProgress variant={'indeterminate'} size={'3.5em'} />
            </Backdrop>
            <Box>
              <Box>
                {proMembership.proposition}
                <br />
                {proMembershipDiscount.proposition}
                <br />
                {proMembership.info}
              </Box>
              <br />
              <div id={id} className={classes.paypalButtonsHeight}>
                {scriptLoading && (
                  <Skeleton width={'100%'} height={'100%'} variant={'rect'} />
                )}
              </div>
            </Box>
          </Box>
          <Dialog open={passwordDialogOpen}>
            <DialogContent>
              <Box mb={2}>
                <Alert severity={passwordError ? 'error' : 'info'}>
                  {passwordError ? passwordError : "Confirm that it's you"}
                </Alert>
              </Box>
              <form onSubmit={handleSubmit}>
                <TextField
                  {...getFieldProps('password')}
                  type={'password'}
                  label={'Password'}
                  error={touched.password && !!errors.password}
                  helperText={passwordHelperText}
                  variant={'outlined'}
                  style={inputStyle}
                />
                <Button disabled={isSubmitting} type={'submit'}>
                  Confirm
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </DialogContent>
        <DialogActions>
          <Button onClick={setUpgradeDialogOpen.setFalse}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
