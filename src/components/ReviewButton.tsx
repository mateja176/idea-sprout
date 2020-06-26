import { Button, ButtonProps, Tooltip } from '@material-ui/core';
import { RateReview } from '@material-ui/icons';
import React from 'react';

export interface ReviewButtonProps extends ButtonProps {}

export const ReviewButton: React.FC<ReviewButtonProps> = (props) => (
  <Tooltip title="Review" placement="top">
    <Button {...props}>
      <RateReview color="primary" />
    </Button>
  </Tooltip>
);
