import Box from '@material-ui/core/Box';
import { ButtonProps } from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import RateReview from '@material-ui/icons/RateReview';
import { useFirestoreDoc, useReviewRef } from 'hooks/firebase';
import { useReviewPromptStyles } from 'hooks/style';
import { User } from 'models/auth';
import { IdeaModel } from 'models/idea';
import React from 'react';
import { getReviewPrompt } from 'utils/idea/review';

export const ReviewButton: React.FC<
  {
    reviewOpen: boolean;
    ideaId: IdeaModel['id'];
    uid: User['uid'];
    reviewCount: number;
    style: React.CSSProperties;
    tooltipClosed: boolean;
  } & Pick<ButtonProps, 'onClick'>
> = ({
  reviewOpen,
  ideaId,
  uid,
  reviewCount,
  style,
  onClick,
  tooltipClosed,
}) => {
  const reviewRef = useReviewRef(ideaId, uid);

  const review = useFirestoreDoc(reviewRef);

  const classes = useReviewPromptStyles();

  return (
    <Tooltip
      arrow
      classes={classes}
      open={tooltipClosed || review ? undefined : !reviewOpen}
      title={review ? 'Review' : getReviewPrompt(reviewCount)}
    >
      <Box style={style} onClick={onClick}>
        <RateReview color="primary" />
      </Box>
    </Tooltip>
  );
};
