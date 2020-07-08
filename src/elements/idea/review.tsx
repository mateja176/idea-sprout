import { Box, Typography } from '@material-ui/core';
import React from 'react';

export const ratingLabel = (
  <Typography color="textSecondary">Rating*</Typography>
);

export const doNotShareDescription = (
  <Box>
    <Box>
      It's not required, however sharing the idea with a friend or friends who
      may be interested in it, helps the idea grow.
    </Box>
    <Box>
      Ideas which are not shared are like plants which are not watered,
      eventually they shrivel and die.
    </Box>
  </Box>
);

export const reviewRatingHeading = <Typography variant="h5">Rating</Typography>;

export const reviewFeedbackHeading = (
  <Typography variant="h5">Feedback</Typography>
);
