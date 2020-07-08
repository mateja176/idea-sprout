import { Box, Typography } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { Load, ReviewSection } from 'components';
import { reviewFeedbackHeading, reviewRatingHeading } from 'elements';
import { initialReview } from 'models';
import React from 'react';
import { feedbackWrapperStyle, reviewsMb } from './Reviews';

export const ReviewSkeleton: React.FC = () => {
  return (
    <Box mb={reviewsMb}>
      <ReviewSection>
        {reviewRatingHeading}
        <Load>
          <Rating />
        </Load>
      </ReviewSection>
      <ReviewSection>
        {reviewFeedbackHeading}
        <Load>
          <Typography style={feedbackWrapperStyle}>
            {initialReview.feedback}
          </Typography>
        </Load>
      </ReviewSection>
    </Box>
  );
};
