import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { DragIndicator } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
import { DraggablePaper } from 'components';
import { Check, sharingOptions } from 'containers';
import { User } from 'firebase';
import { useFormik } from 'formik';
import {
  createReviewSchema,
  CreationReview,
  FeedbackLength,
  IdeaModel,
  initialCreationReview,
  Review,
} from 'models';
import { equals } from 'ramda';
import React from 'react';
import { useFirestoreDocData, useUser } from 'reactfire';
import { createQueueSnackbar, useActions, useReviewsRef } from 'services';

export interface ReviewDialogProps {
  idea: IdeaModel;
  ideaUrl: string;
  open: boolean;
  toggleOpen: () => void;
}

const dragHandleId = 'drag-handle';

export const ReviewDialog: React.FC<ReviewDialogProps> = ({
  idea,
  ideaUrl,
  open,
  toggleOpen,
}) => {
  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const reviewsRef = useReviewsRef({ id: idea.id });

  const user = useUser<User>();

  const reviewRef = reviewsRef.doc(user.uid);

  const review = useFirestoreDocData<Review | null>(reviewRef);

  const hasShared = idea.sharedBy.includes(user.uid);

  const initialValues: CreationReview = {
    ...initialCreationReview,
    ...review,
    shared: hasShared,
  };

  const {
    handleSubmit,
    isSubmitting,
    getFieldProps,
    errors,
    touched,
    values,
    isValid,
  } = useFormik({
    validationSchema: createReviewSchema,
    initialValues,
    onSubmit: ({ rating, feedback }) => {
      return reviewsRef
        .doc(user.uid)
        .set({ rating, feedback })
        .then(() => {
          queueSnackbar({
            severity: 'success',
            message: 'Review submitted',
          });

          toggleOpen();
        })
        .catch(() => {
          queueSnackbar({
            severity: 'error',
            message: 'Failed to submit, please retry',
          });
        });
    },
  });

  const areValuesEqualToInitial = equals(initialValues)(values);

  const sharePrompt0 = (
    <span>
      Be the first one to share <i>{idea.name}</i>.
    </span>
  );

  const sharePrompt1 = (
    <span>
      <i>{idea.name}</i> has been shared by{' '}
      <span style={{ textDecoration: 'underline' }}>
        {idea.sharedBy.length} {idea.sharedBy.length > 1 ? 'people' : 'person'}
      </span>{' '}
      so far. Would you like to share it too?
    </span>
  );

  return (
    <Dialog // TODO replace modal with custom implementation since elements outside of the dialog cannot be interacted with
      open={open}
      onClose={() => {
        toggleOpen();
      }}
      hideBackdrop
      PaperComponent={DraggablePaper}
    >
      <DialogTitle style={{ cursor: 'grab' }}>
        <Box display="flex" alignItems="center">
          <i>{idea.name}</i>&nbsp;Review
          <Box ml="auto" id={dragHandleId}>
            <DragIndicator color="action" />
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <Typography color="textSecondary">Rating*</Typography>
            <Rating {...getFieldProps('rating')} precision={0.5} />
          </Box>
          <TextField
            {...getFieldProps('feedback')}
            required
            multiline
            rows={5}
            label="Feedback"
            helperText={`What did you like or dislike about the idea? Your feedback directly shapes the course of the idea. ( ${FeedbackLength.min} - )`}
          ></TextField>
          {!false && (
            <Box mt={4}>
              <Typography>
                {idea.sharedBy.length > 0 ? sharePrompt1 : sharePrompt0}
              </Typography>
              <Box mt={1} display="flex" flexWrap="wrap">
                {sharingOptions.map((config) => (
                  <Tooltip
                    key={config.label}
                    placement="top"
                    title={config.label}
                  >
                    <Box mr={1}>
                      <config.Button url={ideaUrl}>
                        <config.Icon size={50} />
                      </config.Button>
                    </Box>
                  </Tooltip>
                ))}
              </Box>
              <Check
                name="doNotShare"
                label="Do not share*"
                description={
                  <Box>
                    <Box>
                      It's not required, however sharing the idea with a friend
                      or friends who may be interested in it, helps the idea
                      grow.
                    </Box>
                    <Box>
                      Ideas which are not shared are like plants which are not
                      watered, eventually they shrivel and die.
                    </Box>
                  </Box>
                }
                getFieldProps={getFieldProps}
                errorMessage={(touched.doNotShare || '') && errors.doNotShare}
              />
            </Box>
          )}
          <DialogActions>
            <Button onClick={toggleOpen}>Cancel</Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isValid || areValuesEqualToInitial}
            >
              Submit
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
