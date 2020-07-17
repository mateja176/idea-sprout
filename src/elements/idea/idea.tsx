import { Typography } from '@material-ui/core';
import { headingIds } from 'models';
import React from 'react';

export const nameTitle = (
  <Typography id={headingIds.name} variant="h5">
    Name
  </Typography>
);

export const taglineTitle = (
  <Typography id={headingIds.tagline} variant="h5">
    Tagline
  </Typography>
);

export const problemSolutionTitle = (
  <Typography id={headingIds.problemSolution} variant="h5">
    Problem-Solution
  </Typography>
);

export const rationaleTitle = (
  <Typography id={headingIds.rationale} variant="h5">
    Rationale
  </Typography>
);
