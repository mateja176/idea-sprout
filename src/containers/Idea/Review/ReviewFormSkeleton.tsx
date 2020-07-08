import { Box, Button, DialogActions, Typography } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { Load, MultilineTextField, SharePrompt } from 'components';
import { Check, sharingOptions } from 'containers';
import { doNotShareDescription, ratingLabel } from 'elements';
import React from 'react';
import { checkWithMessageHeight } from 'styles';
import { feedbackFieldRows, feedbackHelperText } from 'utils';

export interface ReviewFormSkeletonProps {}

export const ReviewFormSkeleton: React.FC<ReviewFormSkeletonProps> = () => (
  <Box>
    <Box mb={2}>
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
    <Box mt={4}>
      <Load>
        <Typography>
          <SharePrompt name={'placeholder'} />
        </Typography>
      </Load>
      <Box mt={1} display="flex" flexWrap="wrap">
        {sharingOptions.map((config) => (
          <Load>
            <Box mr={1}>
              <config.Button url={'https://example.com'}>
                <config.Icon size={50} />
              </config.Button>
            </Box>
          </Load>
        ))}
      </Box>
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
