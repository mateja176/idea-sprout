import { Box, Tab, TabProps, Tooltip } from '@material-ui/core';
import { CloudDownload } from '@material-ui/icons';
import {
  claims,
  FirestoreUser,
  IdeaModel,
  Review,
  ReviewWithAuthor,
} from 'models';
import React from 'react';
import { AuthCheck } from 'reactfire';
import { useReviewsRef, useUsersRef } from 'services';
import { tabChildStyle } from 'styles';
import { convertFirestoreCollection, convertFirestoreDocument } from 'utils';

export const ExportReviews: React.FC<
  { ideaId: IdeaModel['id'] } & Pick<TabProps, 'classes'>
> = ({ ideaId, ...props }) => {
  const reviewsRef = useReviewsRef(ideaId);
  const usersRef = useUsersRef();
  const exportReviews = React.useCallback(() => {
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
              .then(
                ({ displayName, email }) =>
                  ({
                    rating,
                    feedback,
                    authorName: displayName,
                    authorEmail: email,
                  } as ReviewWithAuthor),
              ),
          ),
        ),
      )
      .then(console.log);
  }, [reviewsRef, usersRef]);

  return (
    <Tab
      {...props}
      label={
        <AuthCheck requiredClaims={claims.pro} fallback={<Tab />}>
          <Tooltip title={'Export reviews'}>
            <Box style={tabChildStyle} onClick={exportReviews}>
              <CloudDownload color={'secondary'} />
            </Box>
          </Tooltip>
        </AuthCheck>
      }
    />
  );
};
