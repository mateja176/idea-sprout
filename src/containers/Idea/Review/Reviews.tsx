import { Box, Divider, Typography, useTheme } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { ReviewSection } from 'components';
import { reviewFeedbackHeading, reviewRatingHeading } from 'elements';
import { IdeaModel, initialReview, Review } from 'models';
import React from 'react';
import { useFirestoreCollection } from 'reactfire';
import { useReviewsRef } from 'services';
import { breakWordStyle } from 'styles';

export const reviewsMb = 4;
export const feedbackWrapperStyle: React.CSSProperties = {
  ...breakWordStyle,
  minHeight: 72,
};

export const Reviews: React.FC<Pick<IdeaModel, 'id'>> = ({ id }) => {
  const theme = useTheme();

  const reviewsRef = useReviewsRef(id);

  const reviews = useFirestoreCollection<Review>(reviewsRef);

  const reviewsWithFallback: Review[] = reviews.length
    ? reviews
    : [initialReview];

  return (
    <Box>
      {reviewsWithFallback.map(({ id, rating, feedback }, i, a) => (
        <Box key={id} mb={reviewsMb}>
          <ReviewSection>
            {reviewRatingHeading}
            <Rating readOnly value={rating} />
          </ReviewSection>
          <ReviewSection>
            {reviewFeedbackHeading}
            <Typography style={feedbackWrapperStyle}>{feedback}</Typography>
          </ReviewSection>
          {i < a.length - 1 && (
            <Divider style={{ backgroundColor: theme.palette.grey['500'] }} />
          )}
        </Box>
      ))}
    </Box>
  );
};
