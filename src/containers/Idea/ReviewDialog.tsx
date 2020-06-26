import {
  Box,
  Button,
  DialogActions,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Info } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
import { DraggableDialog } from 'components';
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
import { useUser } from 'reactfire';
import {
  createQueueSnackbar,
  useActions,
  useIdeasRef,
  useReviewsRef,
} from 'services';

export interface ReviewDialogProps {
  idea: IdeaModel;
  ideaUrl: string;
  review: Review | null;
  open: boolean;
  onClose: () => void;
}

export const ReviewDialog: React.FC<ReviewDialogProps> = ({
  idea,
  ideaUrl,
  review,
  open,
  onClose,
}) => {
  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const ideaRef = useIdeasRef().doc(idea.id);

  const reviewsRef = useReviewsRef(idea.id);

  const user = useUser<User>();

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
    setFieldValue,
  } = useFormik({
    validationSchema: createReviewSchema,
    initialValues,
    onSubmit: ({ rating, feedback }) => {
      return reviewsRef
        .doc(user.uid)
        .set({ rating, feedback, author: user.email })
        .then(() => {
          queueSnackbar({
            severity: 'success',
            message: 'Review submitted',
          });

          onClose();
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
    <Box display="flex" alignItems="center">
      <span>
        Care to share?{' '}
        <span style={{ textDecoration: 'underline' }}>
          {idea.sharedBy.length}{' '}
          {idea.sharedBy.length > 1 ? `people` : 'person'}
        </span>{' '}
        has shared <i>{idea.name}</i>.
      </span>
      &nbsp;
      <Tooltip placement="top" title="The share count is unique per person">
        <Info color="action" />
      </Tooltip>
    </Box>
  );

  return (
    <DraggableDialog // TODO replace modal with custom implementation since elements outside of the dialog cannot be interacted with
      open={open}
      onClose={() => {
        onClose();
      }}
      dialogTitle={
        <>
          <i>{idea.name}</i>&nbsp;Review
        </>
      }
    >
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
        <Box mt={4}>
          <Typography>
            {idea.sharedBy.length > 0 ? sharePrompt1 : sharePrompt0}
          </Typography>
          <Box mt={1} display="flex" flexWrap="wrap">
            {sharingOptions.map((config) => (
              <Tooltip key={config.label} placement="top" title={config.label}>
                <Box mr={1}>
                  <config.Button
                    disabled={values.doNotShare}
                    url={ideaUrl}
                    onShareWindowClose={() => {
                      setFieldValue('shared', true);

                      const ideaShard: Pick<IdeaModel, 'sharedBy'> = {
                        sharedBy: idea.sharedBy.concat(user.uid),
                      };

                      ideaRef.update(ideaShard);
                    }}
                  >
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
                  It's not required, however sharing the idea with a friend or
                  friends who may be interested in it, helps the idea grow.
                </Box>
                <Box>
                  Ideas which are not shared are like plants which are not
                  watered, eventually they shrivel and die.
                </Box>
              </Box>
            }
            getFieldProps={getFieldProps}
            errorMessage={(touched.doNotShare || '') && errors.doNotShare}
            disabled={values.shared}
          />
        </Box>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            disabled={isSubmitting || !isValid || areValuesEqualToInitial}
          >
            Submit
          </Button>
        </DialogActions>
      </form>
    </DraggableDialog>
  );
};
