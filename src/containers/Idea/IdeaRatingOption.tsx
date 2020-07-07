import { BoxProps, Button, Tooltip, useTheme } from '@material-ui/core';
import { StarRate } from '@material-ui/icons';
import { IdeaModel } from 'models';
import React from 'react';
import { useIdeaOptionButtonStyle } from 'services';
import { starColor } from 'styles';
import { getRatingHelperText } from 'utils';

export interface IdeaRatingOptionProps
  extends Pick<IdeaModel, 'rating'>,
    Pick<BoxProps, 'onClick'> {}

export const IdeaRatingOption: React.FC<IdeaRatingOptionProps> = ({
  rating,
  onClick,
}) => {
  const buttonStyle = useIdeaOptionButtonStyle();

  const theme = useTheme();

  const ratingTooltip = getRatingHelperText(rating);

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
        {rating.average}
      </Button>
    </Tooltip>
  );
};
