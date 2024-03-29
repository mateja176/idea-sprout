import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import React from 'react';
import { ReviewSection } from '../../../components/Idea/Review/ReviewSection';
import { Load } from '../../../components/Load';
import {
  reviewFeedbackHeading,
  reviewRatingHeading,
} from '../../../elements/idea/review';
import { initialReview } from '../../../models/review';
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
