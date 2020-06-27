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

export interface ReviewsProps {
  name: IdeaModel['name'];
  open: boolean;
  onClose: () => void;
  reviews: Review[];
}

export const Section: React.FC<BoxProps> = (props) => (
  <Box display={'grid'} gridGap={15} my={3} mx={2} {...props} />
);

export const ReviewsDialog: React.FC<ReviewsProps> = ({
  name,
  open,
  reviews,
  onClose,
}) => {
  const theme = useTheme();

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
          <i>{name}</i>&nbsp;Reviews
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
              <Typography>{feedback}</Typography>
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
