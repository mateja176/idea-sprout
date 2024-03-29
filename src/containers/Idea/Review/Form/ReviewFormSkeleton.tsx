import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import React from 'react';
import { Load } from '../../../../components/Load';
import { MultilineTextField } from '../../../../components/MultilineTextField';
import { shareOptions } from '../../../../components/share/share';
import {
  shareOptionMr,
  shareOptionSize,
  ShareOptionsWrapper,
} from '../../../../components/share/ShareOptions';
import { SharePrompt } from '../../../../components/share/SharePrompt';
import {
  doNotShareDescription,
  ratingLabel,
} from '../../../../elements/idea/review';
import {
  feedbackFieldRows,
  feedbackHelperText,
} from '../../../../utils/idea/review';
import { checkWithMessageHeight } from '../../../../utils/styles/styles';
import { Check } from '../../../Check';
import { ratingSectionMb, shareSectionMt } from './ReviewForm';

export interface ReviewFormSkeletonProps {}

export const ReviewFormSkeleton: React.FC<ReviewFormSkeletonProps> = () => (
  <>
    <DialogContent>
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
    </DialogContent>
    <DialogActions>
      <Load>
        <Button>Cancel</Button>
      </Load>
      <Load>
        <Button>Submit</Button>
      </Load>
    </DialogActions>
  </>
);
