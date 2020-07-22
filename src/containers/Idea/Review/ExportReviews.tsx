import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  TabProps,
  Tooltip,
} from '@material-ui/core';
import { CloudDownload, CloudUpload } from '@material-ui/icons';
import { useBoolean } from 'ahooks';
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
  createQueueSnackbar,
  currency,
  Email,
  env,
  useActions,
  useReviewsRef,
  useUsersRef,
} from 'services';
import { tabChildStyle } from 'styles';
import { convertFirestoreCollection, convertFirestoreDocument } from 'utils';

export const ExportReviews: React.FC<
  { idea: IdeaModel } & Required<Pick<User, 'email'>> &
    Pick<TabProps, 'classes'>
> = ({ idea, email, ...props }) => {
  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const reviewsRef = useReviewsRef(idea.id);

  const usersRef = useUsersRef();

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

  const [upgradeDialogOpen, setUpgradeDialogOpen] = useBoolean();

  const placeOrder = React.useCallback(() => {
    Email.send({
      Host: env.smtpHost,
      Username: env.smtpUsername,
      Password: env.smtpPassword,
      To: env.smtpTo,
      From: env.smtpFrom,
      Subject: 'Pro Membership Order',
      Body: `Order placed by ${email}`,
    }).then(() => {
      queueSnackbar({
        severity: 'success',
        message:
          "You'll receive an email, up to 12 hours from now, stating that your membership is active",
        autoHideDuration: 10000,
      });
    });
  }, [email, queueSnackbar]);

  return (
    <>
      <Tab
        {...props}
        disabled={loading}
        label={
          <AuthCheck
            requiredClaims={claims.pro}
            fallback={
              <Tooltip title={'Export reviews'}>
                <Box
                  style={tabChildStyle}
                  onClick={setUpgradeDialogOpen.setTrue}
                >
                  <CloudUpload color={'secondary'} />
                </Box>
              </Tooltip>
            }
          >
            <Tooltip title={'Export reviews'}>
              <Box style={tabChildStyle} onClick={exportReviews}>
                <CloudDownload color={'secondary'} />
              </Box>
            </Tooltip>
          </AuthCheck>
        }
      />
      <Dialog open={upgradeDialogOpen}>
        <DialogTitle>
          Become a Pro:{' '}
          <span style={{ textDecoration: 'line-through' }}>
            {currency.format(19.99)}
          </span>{' '}
          <span>{currency.format(9.99)}</span>
        </DialogTitle>
        <DialogContent style={{ textAlign: 'justify' }}>
          <Box>
            Having access to reviews is extremely powerful as you are able to
            build a <strong>mailing list</strong> about users who reviewed your
            idea. Additionally, you're able to use the{' '}
            <strong>reviews as testimonials</strong> on your website.
          </Box>
          <br />
          <Box>
            Bear in mind that, because of the <i>high demand</i>, the activation
            of your pro membership may last <i>up to 12 hours</i>. You will be
            notified promptly when your membership is activated. After you
            receive the email, in order for your newly found privileges to take
            effect immediately, it is required to{' '}
            <i>sign out and sign in again</i>, after which you can use the app
            to its full extent.
          </Box>
          <br />
          <Box>
            The pro membership lasts for one month unless you renew it during
            the following <i>30 days</i>. If you have any questions or concerns,
            feel free to contact us directly by writing an email to{' '}
            <i>startupideasprout@gmail.com</i>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={setUpgradeDialogOpen.setFalse}>Close</Button>
          <Button onClick={placeOrder} color={'secondary'}>
            Become a Pro
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
