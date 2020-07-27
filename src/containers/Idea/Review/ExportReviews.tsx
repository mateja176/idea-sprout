import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  makeStyles,
  Tab,
  TabProps,
  Tooltip,
} from '@material-ui/core';
import {
  Beenhere,
  CloudDownload,
  EmojiEvents,
  ExpandMore,
  HourglassEmpty,
} from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { useBoolean } from 'ahooks';
import { proMembership, proMembershipDiscount } from 'elements';
import { parseAsync } from 'json2csv';
import { kebabCase } from 'lodash';
import {
  claims,
  FirestoreUser,
  IdeaModel,
  Order,
  Review,
  ReviewWithAuthor,
  User,
  WithPaypal,
} from 'models';
import React from 'react';
import { AuthCheck } from 'reactfire';
import {
  createQueueSnackbar,
  Email,
  env,
  formatCurrency,
  useActions,
  useFirestoreDoc,
  useRetry,
  useReviewsRef,
  useUsersRef,
} from 'services';
import {
  paypalButtonsHeight,
  paypalHeightBreakpoint,
  tabChildStyle,
} from 'styles';
import { convertFirestoreCollection, convertFirestoreDocument } from 'utils';

const id = 'paypal-container';

const scriptId = 'paypal-script';

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
  { idea: IdeaModel; isAuthor: boolean } & Required<
    Pick<User, 'uid' | 'email'>
  > &
    Pick<TabProps, 'classes'>
> = ({ idea, uid, email, isAuthor, ...props }) => {
  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const reviewsRef = useReviewsRef(idea.id);

  const usersRef = useUsersRef();

  const userRef = React.useMemo(() => usersRef.doc(uid), [usersRef, uid]);

  const user = useFirestoreDoc<FirestoreUser>(userRef);

  const classes = useStyles();

  const [loading, setLoading] = useBoolean();

  const exportReviews = React.useCallback(() => {
    setLoading.setTrue();

    reviewsRef
      .get()
      .then((collection) => convertFirestoreCollection<Review>(collection))
      .then((reviews) =>
        Promise.all(
          reviews.map(({ id, rating, feedback }) =>
            usersRef
              .doc(id)
              .get()
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
              }),
          ),
        ),
      )
      .then((reviews) => parseAsync(reviews))
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
  }, [reviewsRef, usersRef, idea, setLoading]);

  const [upgradeDialogOpen, setUpgradeDialogOpen] = useBoolean(false);

  const [scriptLoading, setScriptLoading] = useBoolean();

  const [processing, setProcessing] = useBoolean();

  const sendEmail = React.useCallback(
    (order: Order) => {
      setProcessing.setTrue();
      return Email.send({
        Host: env.smtpHost,
        Username: env.smtpUsername,
        Password: env.smtpPassword,
        To: env.smtpTo,
        From: env.smtpFrom,
        Subject: 'Pro Membership Order',
        Body: `- Order placed by: ${email}
- Order id is: ${order.id}`,
      })
        .then(() => userRef.update({ proMembershipOrder: order.id }))
        .then(() => {
          setProcessing.setFalse();

          setUpgradeDialogOpen.setFalse();

          queueSnackbar({
            severity: 'success',
            message:
              "You'll receive an email, up to 12 hours from now, stating that your membership is active",
            autoHideDuration: 10000,
          });
        });
    },
    [email, queueSnackbar, setUpgradeDialogOpen, setProcessing, userRef],
  );

  const sendEmailWithRetry = useRetry({
    request: sendEmail,
    maxAttempts: 2,
    onError: (error: Error) => {
      console.warn('Error while sending order:', error);

      setProcessing.setFalse();

      setUpgradeDialogOpen.setFalse();

      queueSnackbar({
        severity: 'error',
        message:
          'Something went wrong while sending order. Please contact support via chat or startupideasprout@gmail.com',
        autoHideDuration: 60000,
      });
    },
  });

  const renderButtons = React.useCallback(() => {
    ((window as unknown) as WithPaypal).paypal
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
        onApprove: (_, actions) =>
          actions.order.capture().then(sendEmailWithRetry),
      })
      .render(`#${id}`);
  }, [sendEmailWithRetry]);

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

  const [infoDialogOpen, setInfoDialogOpen] = useBoolean();

  const placedOrder = !!user?.proMembershipOrder;

  return (
    <>
      <Tab
        {...props}
        disabled={loading}
        label={
          <AuthCheck
            requiredClaims={claims.pro}
            fallback={
              placedOrder ? (
                <Tooltip title={'Membership is being processed'}>
                  <Box
                    style={tabChildStyle}
                    onClick={setInfoDialogOpen.setTrue}
                  >
                    <HourglassEmpty color={'secondary'} />
                  </Box>
                </Tooltip>
              ) : isAuthor ? (
                <Tooltip title={'Export reviews'}>
                  <Box style={tabChildStyle} onClick={openUpgradeDialog}>
                    <CloudDownload color={'secondary'} />
                  </Box>
                </Tooltip>
              ) : (
                becomeAPro
              )
            }
          >
            {isAuthor ? (
              <Tooltip title={'Export reviews'}>
                <Box style={tabChildStyle} onClick={exportReviews}>
                  <CloudDownload color={'secondary'} />
                </Box>
              </Tooltip>
            ) : (
              <Tooltip title={"You're already a pro"}>
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
          <span style={{ textDecoration: 'line-through' }}>
            {formatCurrency(proMembership.amount.value)}
          </span>{' '}
          <span>{formatCurrency(proMembershipDiscount.amount.value)}</span>
        </DialogTitle>
        <DialogContent style={{ overflowY: 'scroll' }}>
          <Box textAlign={'justify'} position={'relative'}>
            <Backdrop open={processing} className={classes.backdrop}>
              <CircularProgress variant={'indeterminate'} size={'3.5em'} />
            </Backdrop>
            <Box visibility={processing ? 'hidden' : 'visible'}>
              <Box>
                {proMembership.proposition}
                <br />
                {proMembershipDiscount.proposition}
                <br />
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                    Important note
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    {proMembership.info}
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </Box>
              <br />
              <div id={id} className={classes.paypalButtonsHeight}>
                {scriptLoading && (
                  <Skeleton width={'100%'} height={'100%'} variant={'rect'} />
                )}
              </div>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={setUpgradeDialogOpen.setFalse}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={infoDialogOpen} onClose={setInfoDialogOpen.setFalse}>
        <DialogContent>{proMembership.info}</DialogContent>
        <DialogActions>
          <Button onClick={setInfoDialogOpen.setFalse}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
