import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Tab,
  TabProps,
  Tooltip,
} from '@material-ui/core';
import { CloudDownload, CloudUpload, EmojiEvents } from '@material-ui/icons';
import { useBoolean } from 'ahooks';
import { proMembership, proMembershipDiscount } from 'elements';
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
  formatCurrency,
  useBooleanWithFallback,
  useReviewsRef,
  useUsersRef,
} from 'services';
import { tabChildStyle } from 'styles';
import { convertFirestoreCollection, convertFirestoreDocument } from 'utils';
import { ExportReviewsContent } from './ExportReviewsContent';

export const ExportReviews: React.FC<
  { idea: IdeaModel; isAuthor: boolean } & Required<Pick<User, 'email'>> &
    Pick<TabProps, 'classes'>
> = ({ idea, isAuthor, email, ...props }) => {
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

  const openWithFallback = useBooleanWithFallback(upgradeDialogOpen, {
    timeoutMs: 500,
  });

  const becomeAPro = (
    <Tooltip title={'Become a Pro'}>
      <Box style={tabChildStyle} onClick={setUpgradeDialogOpen.setTrue}>
        <EmojiEvents color={'secondary'} />
      </Box>
    </Tooltip>
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
                  <Box
                    style={tabChildStyle}
                    onClick={setUpgradeDialogOpen.setTrue}
                  >
                    <CloudUpload color={'secondary'} />
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
              becomeAPro
            )}
          </AuthCheck>
        }
      />
      <Dialog open={upgradeDialogOpen} fullScreen>
        <DialogTitle>
          Become a Pro:{' '}
          <span style={{ textDecoration: 'line-through' }}>
            {formatCurrency(proMembership.amount.value)}
          </span>{' '}
          <span>{formatCurrency(proMembershipDiscount.amount.value)}</span>
        </DialogTitle>
        {openWithFallback && (
          <ExportReviewsContent
            email={email}
            onClose={setUpgradeDialogOpen.setFalse}
          />
        )}
        <DialogActions>
          <Button onClick={setUpgradeDialogOpen.setFalse}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
