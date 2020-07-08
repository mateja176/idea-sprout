import { Box, Button, DialogActions, Typography } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import {
  Load,
  MultilineTextField,
  shareOptionMr,
  shareOptions,
  shareOptionSize,
  ShareOptionsWrapper,
  SharePrompt,
} from 'components';
import { Check } from 'containers';
import { doNotShareDescription, ratingLabel } from 'elements';
import React from 'react';
import { checkWithMessageHeight } from 'styles';
import { feedbackFieldRows, feedbackHelperText } from 'utils';
import { ratingSectionMb, shareSectionMt } from './ReviewForm';

export interface ReviewFormSkeletonProps {}

export const ReviewFormSkeleton: React.FC<ReviewFormSkeletonProps> = () => (
  <Box>
    <Box mb={ratingSectionMb}>
      <Load>{ratingLabel}</Load>
      <br />
      <Load>
        <Rating />
      </Load>
    </Box>
    <Load>
      <MultilineTextField
        required
        rows={feedbackFieldRows}
        helperText={feedbackHelperText}
      />
    </Load>
    <Box mt={shareSectionMt}>
      <Load>
        <Typography>
          <SharePrompt name={'placeholder'} />
        </Typography>
      </Load>
      <ShareOptionsWrapper>
        {shareOptions.map((option) => (
          <Box key={option.label} mr={shareOptionMr}>
            <Load variant="circle">
              <option.Icon size={shareOptionSize} />
            </Load>
          </Box>
        ))}
      </ShareOptionsWrapper>
      <Load>
        <Check
          label="Do not share*"
          description={doNotShareDescription}
          checked
          name="doNotShare"
          height={checkWithMessageHeight}
        />
      </Load>
    </Box>
    <DialogActions>
      <Load>
        <Button>Cancel</Button>
      </Load>
      <Load>
        <Button>Submit</Button>
      </Load>
    </DialogActions>
  </Box>
);
