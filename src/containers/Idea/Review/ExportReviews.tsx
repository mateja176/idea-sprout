import { Box, Tab, TabProps, Tooltip } from '@material-ui/core';
import { CloudDownload } from '@material-ui/icons';
import { parseAsync } from 'json2csv';
import { kebabCase } from 'lodash';
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
import { useBoolean } from 'ahooks';

export const ExportReviews: React.FC<
  { idea: IdeaModel } & Pick<TabProps, 'classes'>
> = ({ idea, ...props }) => {
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

  return (
    <Tab
      {...props}
      disabled={loading}
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
