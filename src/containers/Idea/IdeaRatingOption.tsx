import { BoxProps, Button, Tooltip, useTheme } from '@material-ui/core';
import { StarRate } from '@material-ui/icons';
import { IdeaModel, Review } from 'models';
import React from 'react';
import {
  useFirestoreCollection,
  useIdeaOptionButtonStyle,
  useReviewsRef,
} from 'services';
import { starColor } from 'styles';
import { getRatingHelperText } from 'utils';

export interface IdeaRatingOptionProps
  extends Pick<IdeaModel, 'id'>,
    Pick<BoxProps, 'onClick'> {}

export const IdeaRatingOption: React.FC<IdeaRatingOptionProps> = ({
  id,
  onClick,
}) => {
  const buttonStyle = useIdeaOptionButtonStyle();

  const theme = useTheme();

  const reviewsRef = useReviewsRef(id);

  const reviews = useFirestoreCollection<Review>(reviewsRef);

  const ratingsCount = reviews.length;

  const totalRating =
    reviews.reduce((total, { rating }) => total + rating, 0) / ratingsCount;

  const averageRating = totalRating ? totalRating / ratingsCount : 0;

  const ratingConfig = {
    count: ratingsCount,
    average: averageRating,
  };

  const ratingTooltip = getRatingHelperText(ratingConfig);

  return (
    <Tooltip placement="top" title={ratingTooltip}>
      <Button
        style={{
          ...buttonStyle,
          color: theme.palette.action.active,
        }}
        endIcon={<StarRate style={{ color: starColor }} />}
        onClick={onClick}
      >
        {averageRating}
      </Button>
    </Tooltip>
  );
};
