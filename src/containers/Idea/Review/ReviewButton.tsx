import { Box, ButtonProps, makeStyles, Tooltip } from '@material-ui/core';
import { RateReview } from '@material-ui/icons';
import { IdeaModel, User } from 'models';
import React from 'react';
import { useFirestoreDoc, useReviewRef } from 'services';

const useStyles = makeStyles((theme) => ({
  tooltip: {
    background: theme.palette.primary.main,
    fontSize: '0.8em',
  },
  arrow: {
    color: theme.palette.primary.main,
  },
}));

export const ReviewButton: React.FC<
  {
    reviewOpen: boolean;
    ideaId: IdeaModel['id'];
    uid: User['uid'];
    reviewCount: number;
    style: React.CSSProperties;
  } & Pick<ButtonProps, 'onClick'>
> = ({ reviewOpen, ideaId, uid, reviewCount, style, onClick }) => {
  const reviewRef = useReviewRef(ideaId, uid);

  const review = useFirestoreDoc(reviewRef);

  const classes = useStyles();

  return (
    <Tooltip
      arrow
      classes={classes}
      open={review ? undefined : !reviewOpen}
      title={
        review
          ? 'Review'
          : reviewCount > 1
          ? `Join the ${reviewCount} people who reviewed`
          : "Your review directly impacts the idea's lifecycle"
      }
    >
      <Box style={style} onClick={onClick}>
        <RateReview color="primary" />
      </Box>
    </Tooltip>
  );
};
