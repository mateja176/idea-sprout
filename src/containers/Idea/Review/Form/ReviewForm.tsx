import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import { MultilineTextField } from 'components/MultilineTextField';
import { ShareOptions, SharePrompt } from 'components/share';
import { Check } from 'containers/Check';
import { ratingLabel } from 'elements/idea';
import { useFormik } from 'formik';
import { User } from 'models/auth';
import { CheckProps, IdeaModel } from 'models/idea';
import {
  createReviewSchema,
  CreationReview,
  FeedbackLength,
  initialCreationReview,
  Review,
} from 'models/review';
import React from 'react';
import {
  useFirestoreDoc,
  useReviewsRef,
  useReviewSubmit,
  useShareIdea,
} from 'services/hooks';
import { checkWithMessageHeight } from 'styles/styles';
import {
  doNotShareWarning,
  feedbackFieldRows,
  feedbackHelperText,
} from 'utils/idea/review';

export interface ReviewFormProps extends Pick<User, 'uid'> {
  idea: IdeaModel;
  ideaUrl: string;
  onClose: () => void;
}

export const ratingSectionMb = 2;
export const shareSectionMt = 4;

const badgeStyle: React.CSSProperties = {
  marginRight: 10,
};

export const ReviewForm: React.FC<ReviewFormProps> = ({
  uid,
  idea,
  ideaUrl,
  onClose,
}) => {
  const reviewsRef = useReviewsRef(idea.id);
  const reviewRef = React.useMemo(() => reviewsRef.doc(uid), [reviewsRef, uid]);

  const review = useFirestoreDoc<Review>(reviewRef);

  const shareIdea = useShareIdea(idea);

  const shareCount = React.useMemo(() => Object.keys(idea.sharedBy).length, [
    idea.sharedBy,
  ]);

  const hasShared = React.useMemo(
    () => Object.keys(idea.sharedBy).includes(uid),
    [idea.sharedBy, uid],
  );

  const [doNotShareOrWarn, setDoNotShareOrWarn] = React.useState<
    null | true | string
  >(null);

  const hasSharedOrDeclined = hasShared || doNotShareOrWarn === true;

  const initialValues: CreationReview = React.useMemo(
    () => ({
      ...initialCreationReview,
      ...review,
    }),
    [review],
  );

  const onSubmit = useReviewSubmit({ idea, currentReview: review });

  const {
    handleSubmit,
    isSubmitting,
    getFieldProps,
    errors,
    touched,
    values,
    submitForm,
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

        return Promise.resolve(); // * in order to toggle isSubmitting
      }
    },
  });

  const doNotShare: CheckProps['onChange'] = React.useCallback(
    (e, value) => {
      setDoNotShareOrWarn(value === true || doNotShareWarning);
    },
    [setDoNotShareOrWarn],
  );

  return (
    <>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Box mb={ratingSectionMb}>
            {ratingLabel}
            <Rating {...getFieldProps('rating')} precision={1} />
          </Box>
          <Badge
            color={'secondary'}
            badgeContent={
              values.feedback.length < FeedbackLength.min
                ? `${FeedbackLength.min} < ${values.feedback.length}`
                : null
            }
            style={badgeStyle}
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
              <SharePrompt name={idea.name} sharedByCount={shareCount} />
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
              onChange={doNotShare}
              name="doNotShare"
              errorMessage={
                typeof doNotShareOrWarn === 'string' ? doNotShareOrWarn : ''
              }
              disabled={hasShared}
              height={checkWithMessageHeight}
            />
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={submitForm} type="submit" disabled={isSubmitting}>
          Submit
        </Button>
      </DialogActions>
    </>
  );
};
