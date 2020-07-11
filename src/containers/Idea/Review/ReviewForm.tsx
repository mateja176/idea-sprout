import {
  Badge,
  Box,
  Button,
  DialogActions,
  Typography,
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { MultilineTextField, ShareOptions, SharePrompt } from 'components';
import { Check } from 'containers';
import { ratingLabel } from 'elements';
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
  useFirestoreDoc,
  useReviewsRef,
  useReviewSubmit,
  useShareIdea,
} from 'services';
import { checkWithMessageHeight } from 'styles';
import {
  doNotShareWarning,
  feedbackFieldRows,
  feedbackHelperText,
} from 'utils';

export interface ReviewFormProps extends Pick<User, 'uid'> {
  idea: IdeaModel;
  ideaUrl: string;
  onClose: () => void;
}

export const ratingSectionMb = 2;
export const shareSectionMt = 4;

export const ReviewForm: React.FC<ReviewFormProps> = ({
  uid,
  idea,
  ideaUrl,
  onClose,
}) => {
  const reviewRef = useReviewsRef(idea.id).doc(uid);

  const review = useFirestoreDoc<Review>(reviewRef);

  const shareIdea = useShareIdea(idea);

  const hasShared = idea.sharedBy.includes(uid);

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
    onSubmit: ({ rating, ...formValues }) => {
      if (hasSharedOrDeclined) {
        return onSubmit({ ...formValues, rating: Number(rating) }).then(
          onClose,
        );
      } else {
        setDoNotShareOrWarn(doNotShareWarning);
      }
    },
  });

  const areValuesEqualToInitial = equals(initialValues)(values);

  return (
    <form onSubmit={handleSubmit}>
      <Box mb={ratingSectionMb}>
        {ratingLabel}
        <Rating {...getFieldProps('rating')} precision={0.5} />
      </Box>
      <Badge
        color={'secondary'}
        badgeContent={
          values.feedback.length < FeedbackLength.min
            ? `${FeedbackLength.min} < ${values.feedback.length}`
            : null
        }
        style={{
          marginRight: 10,
        }}
      >
        <MultilineTextField
          {...getFieldProps('feedback')}
          required
          rows={feedbackFieldRows}
          label={'Feedback'}
          error={touched.feedback && !!errors.feedback}
          helperText={feedbackHelperText}
        />
      </Badge>
      <Box mt={shareSectionMt}>
        <Typography>
          <SharePrompt name={idea.name} sharedByCount={idea.sharedBy.length} />
        </Typography>
        <ShareOptions
          ideaUrl={ideaUrl}
          shareIdea={shareIdea}
          disabled={doNotShareOrWarn === true}
        />
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
  );
};
