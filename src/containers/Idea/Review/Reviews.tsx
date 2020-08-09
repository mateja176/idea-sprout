import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import useTheme from '@material-ui/core/styles/useTheme';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import { ReviewSection } from 'components';
import { reviewFeedbackHeading, reviewRatingHeading } from 'elements';
import { IdeaModel, Review } from 'models';
import React from 'react';
import { useFirestoreCollection, useReviewsRef } from 'services/hooks';
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

  const dividerStyle: React.CSSProperties = React.useMemo(
    () => ({ backgroundColor: theme.palette.grey['500'] }),
    [theme],
  );

  return (
    <Box>
      {reviews.map(({ id, rating, feedback }, i, a) => (
        <Box key={id} mb={reviewsMb}>
          <ReviewSection>
            {reviewRatingHeading}
            <Rating readOnly value={rating} />
          </ReviewSection>
          <ReviewSection>
            {reviewFeedbackHeading}
            <Typography style={feedbackWrapperStyle}>{feedback}</Typography>
          </ReviewSection>
          {i < a.length - 1 && <Divider style={dividerStyle} />}
        </Box>
      ))}
    </Box>
  );
};
