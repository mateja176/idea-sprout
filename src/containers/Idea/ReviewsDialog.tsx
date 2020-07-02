import {
  Box,
  BoxProps,
  Button,
  Divider,
  Typography,
  useTheme,
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { DraggableDialog } from 'containers';
import { IdeaModel, initialReview, Review } from 'models';
import React from 'react';
import { useFirestoreCollection, useReviewsRef } from 'services';
import { withEllipsis } from 'styles';

export interface ReviewsProps extends Pick<IdeaModel, 'id' | 'name'> {
  open: boolean;
  onClose: () => void;
}

export const Section: React.FC<BoxProps> = (props) => (
  <Box display={'grid'} gridGap={15} my={3} mx={2} {...props} />
);

export const ReviewsDialog: React.FC<ReviewsProps> = ({
  id,
  name,
  open,
  onClose,
}) => {
  const theme = useTheme();

  const reviewsRef = useReviewsRef(id);

  const reviews = useFirestoreCollection<Review>(reviewsRef);

  const reviewsWithFallback: Review[] = reviews.length
    ? reviews
    : [initialReview];

  return (
    <DraggableDialog
      open={open}
      onClose={onClose}
      scroll="paper"
      dialogTitle={
        <>
          Reviews:&nbsp;<i style={withEllipsis}>{name}</i>
        </>
      }
      actions={<Button onClick={onClose}>Close</Button>}
    >
      {reviews.length ? '' : <Typography>No reviews yet.</Typography>}
      <Box visibility={reviews.length ? 'visible' : 'hidden'}>
        {reviewsWithFallback.map(({ id, rating, feedback, author }, i, a) => (
          <Box key={id} mb={4}>
            <Section>
              <Typography variant="h5">Rating</Typography>
              <Rating readOnly value={rating} />
            </Section>
            <Section>
              <Typography variant="h5">Feedback</Typography>
              <Typography style={{ wordBreak: 'break-word' }}>
                {feedback}
              </Typography>
            </Section>
            <Section>
              <Typography variant="h5">Author</Typography>
              <Typography>{author}</Typography>
            </Section>
            {i < a.length - 1 && (
              <Divider style={{ backgroundColor: theme.palette.grey['500'] }} />
            )}
          </Box>
        ))}
      </Box>
    </DraggableDialog>
  );
};
