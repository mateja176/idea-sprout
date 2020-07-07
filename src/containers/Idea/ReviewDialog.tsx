import {
  Box,
  Button,
  DialogActions,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Info } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
import { MultilineTextField } from 'components';
import { Check, DraggableDialog, sharingOptions } from 'containers';
import 'firebase/firestore';
import { useFormik } from 'formik';
import {
  createReviewSchema,
  CreationReview,
  FeedbackLength,
  IdeaModel,
  initialCreationReview,
  Review,
  User,
} from 'models';
import { equals } from 'ramda';
import React from 'react';
import {
  useFirestoreCollection,
  useReviewsRef,
  useReviewSubmit,
  useShareIdea,
} from 'services';
import { checkWithMessageHeight, withEllipsis } from 'styles';

export interface ReviewDialogProps {
  user: User;
  idea: IdeaModel;
  ideaUrl: string;
  open: boolean;
  onClose: () => void;
}

export const doNotShareWarning =
  'Share the idea to help it grow or just tick the above checkbox';

export const ReviewDialog: React.FC<ReviewDialogProps> = ({
  user,
  idea,
  ideaUrl,
  open,
  onClose,
}) => {
  const reviewsRef = useReviewsRef(idea.id).where('author', '==', user.email);

  const [review] = useFirestoreCollection<Review>(reviewsRef);
  console.log(idea.name, review);

  const shareIdea = useShareIdea(idea);

  const hasShared = idea.sharedBy.includes(user.uid);

  const [doNotShareOrWarn, setDoNotShareOrWarn] = React.useState<
    null | true | string
  >(null);

  const hasSharedOrDeclined = hasShared || doNotShareOrWarn === true;

  const initialValues: CreationReview = {
    ...initialCreationReview,
    ...review,
  };

  const onSubmit = useReviewSubmit({ idea, currentReview: review });

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
    onSubmit: (formValues) => {
      if (hasSharedOrDeclined) {
        return onSubmit(formValues).then(onClose);
      } else {
        setDoNotShareOrWarn(doNotShareWarning);
      }
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
        shared <i>{idea.name}</i>.
      </span>
      &nbsp;
      <Tooltip placement="top" title="The share count is unique per person">
        <Info color="action" />
      </Tooltip>
    </Box>
  );

  return (
    <DraggableDialog
      open={open}
      onClose={() => {
        onClose();
      }}
      dialogTitle={
        <>
          Review:&nbsp;<i style={withEllipsis}>{idea.name}</i>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <Typography color="textSecondary">Rating*</Typography>
          <Rating {...getFieldProps('rating')} precision={0.5} />
        </Box>
        <MultilineTextField
          {...getFieldProps('feedback')}
          required
          rows={5}
          label="Feedback"
          error={touched.feedback && !!errors.feedback}
          helperText={
            (touched.feedback && errors.feedback) ||
            `What did you like or dislike about the idea? Your feedback directly shapes the course of the idea. ( ${FeedbackLength.min} - )`
          }
        />
        <Box mt={4}>
          <Typography>
            {idea.sharedBy.length > 0 ? sharePrompt1 : sharePrompt0}
          </Typography>
          <Box mt={1} display="flex" flexWrap="wrap">
            {sharingOptions.map((config) => (
              <Tooltip key={config.label} placement="top" title={config.label}>
                <Box mr={1}>
                  <config.Button
                    disabled={doNotShareOrWarn === true}
                    url={ideaUrl}
                    onShareWindowClose={shareIdea}
                  >
                    <config.Icon size={50} />
                  </config.Button>
                </Box>
              </Tooltip>
            ))}
          </Box>
          <Check
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
            checked={doNotShareOrWarn === true}
            onChange={(e, value) => {
              setDoNotShareOrWarn(value === true || doNotShareWarning);
            }}
            name="doNotShare"
            errorMessage={
              typeof doNotShareOrWarn === 'string' ? doNotShareOrWarn : ''
            }
            disabled={hasShared}
            height={checkWithMessageHeight}
          />
        </Box>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            disabled={
              isSubmitting ||
              !isValid ||
              areValuesEqualToInitial ||
              !hasSharedOrDeclined
            }
          >
            Submit
          </Button>
        </DialogActions>
      </form>
    </DraggableDialog>
  );
};
