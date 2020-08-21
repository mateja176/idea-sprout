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
import Tooltip from '@material-ui/core/Tooltip';
import Beenhere from '@material-ui/icons/Beenhere';
import CloudDownload from '@material-ui/icons/CloudDownload';
import EmojiEvents from '@material-ui/icons/EmojiEvents';
import Skeleton from '@material-ui/lab/Skeleton';
import { useBoolean } from 'ahooks';
import { ProMembership } from 'containers/ProMembership';
import { SnackbarContext } from 'context/snackbar';
import { proMembership, proMembershipDiscount } from 'elements/upgrade';
import firebase, { User } from 'firebase/app';
import { useReviewsRef, useUpgradeToPro, useUsersRef } from 'hooks/firebase';
import { useRenderButtons } from 'hooks/upgrade';
import jsonexport from 'jsonexport/dist';
import kebabCase from 'lodash/kebabCase';
import { FirestoreUser } from 'models/auth';
import { claims } from 'models/firebase';
import { IdeaModel } from 'models/idea';
import { Review, ReviewWithAuthor } from 'models/review';
import React from 'react';
import { AuthCheck } from 'reactfire';
import { exportFile } from 'services/files';
import { formatCurrency } from 'services/format';
import { hasPaypalScriptLoaded, loadPaypalScript } from 'services/upgrade';
import {
  convertFirestoreCollection,
  convertFirestoreDocument,
} from 'utils/firebase';
import {
  paypalButtonsHeight,
  paypalHeightBreakpoint,
} from 'utils/styles/paypal';
import { tabChildStyle } from 'utils/styles/styles';

const id = 'paypal-container';

const dialogContentStyle: React.CSSProperties = { overflowY: 'auto' };

const originalPriceStyle: React.CSSProperties = {
  textDecoration: 'line-through',
};

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
      .then((csv) =>
        exportFile({
          name: `${kebabCase(idea.name)}_reviews.csv`,
          content: csv,
        }),
      )
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

  const renderButtons = useRenderButtons({
    id,
    upgrade,
    onApprove: setApproving.setTrue,
    close,
  });

  const loadScript = React.useCallback(() => {
    setScriptLoading.setTrue();

    loadPaypalScript().then(() => {
      setScriptLoading.setFalse();

      renderButtons();
    });
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
    if (hasPaypalScriptLoaded()) {
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
        </DialogContent>
        <DialogActions>
          <Button onClick={setUpgradeDialogOpen.setFalse}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
