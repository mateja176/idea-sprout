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
} from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { useBoolean } from 'ahooks';
import { proMembership, proMembershipDiscount } from 'elements';
import firebase from 'firebase/app';
import { parseAsync } from 'json2csv';
import { kebabCase } from 'lodash';
import {
  claims,
  FirestoreUser,
  IdeaModel,
  Review,
  ReviewWithAuthor,
  User,
} from 'models';
import React from 'react';
import { AuthCheck } from 'reactfire';
import {
  env,
  formatCurrency,
  useReviewsRef,
  useUpgradeToPro,
  useUsersRef,
} from 'services';
import {
  paypalButtonsHeight,
  paypalHeightBreakpoint,
  tabChildStyle,
} from 'styles';
import { paypal } from 'types';
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
  { idea: IdeaModel } & Required<Pick<User, 'uid' | 'email'>> &
    Pick<TabProps, 'classes' | 'style'>
> = ({ idea, uid, email, ...props }) => {
  const upgradeToPro = useUpgradeToPro();

  const isAuthor = idea.author === uid;

  const reviewsRef = useReviewsRef(idea.id);

  const usersRef = useUsersRef();

  const classes = useStyles();

  const [loading, setLoading] = useBoolean();

  const exportReviews = React.useCallback(() => {
    setLoading.setTrue();

    reviewsRef
      .get()
      .catch(
        () =>
          new Promise<firebase.firestore.QuerySnapshot>((resolve) => {
            setTimeout(() => {
              reviewsRef.get().then(resolve);
            }, 2000);
          }),
      )
      .then((collection) => convertFirestoreCollection<Review>(collection))
      .then((reviews) =>
        Promise.all(
          reviews.map(({ id, rating, feedback }) => {
            const userRef = usersRef.doc(id);

            return userRef
              .get()
              .catch(
                () =>
                  new Promise<firebase.firestore.DocumentSnapshot>(
                    (resolve) => {
                      setTimeout(() => {
                        userRef.get().then(resolve);
                      }, 2000);
                    },
                  ),
              )
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

  const [approving, setApproving] = useBoolean();

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

          return actions.order
            .capture()
            .catch(
              () =>
                new Promise<paypal.Order>((resolve) => {
                  setTimeout(() => {
                    actions.order.capture().then(resolve);
                  }, 2000);
                }),
            )
            .then(({ id }) =>
              upgradeToPro({ orderId: id }).catch(
                () =>
                  new Promise<firebase.functions.HttpsCallableResult>(
                    (resolve) => {
                      setTimeout(() => {
                        upgradeToPro({ orderId: id }).then(resolve);
                      }, 2000);
                    },
                  ),
              ),
            )
            .then(() => {
              setApproving.setFalse();
              setUpgradeDialogOpen.setFalse();
            });
        },
      })
      .render(`#${id}`);
  }, [upgradeToPro, setApproving, setUpgradeDialogOpen]);

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
            <Backdrop open={approving} className={classes.backdrop}>
              <CircularProgress variant={'indeterminate'} size={'3.5em'} />
            </Backdrop>
            <Box>
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
    </>
  );
};
