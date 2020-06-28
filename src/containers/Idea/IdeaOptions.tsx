import {
  Box,
  Button,
  Hidden,
  Icon,
  makeStyles,
  Tooltip,
  useTheme,
} from '@material-ui/core';
import { ExpandLess, ExpandMore, StarRate } from '@material-ui/icons';
import { ShareMenu } from 'containers';
import { IdeaModel, Review } from 'models';
import { isNil } from 'ramda';
import React from 'react';
import { useIdeaOptionButtonStyle } from 'services';
import { starColor } from 'styles';
import { getRatingHelperText } from 'utils';

export interface IdeaOptionsProps {
  idea: IdeaModel;
  ideaUrl: string;
  reviews: Review[];
  toggleReviewsOpen: () => void;
  configButton: React.ReactElement;
  navigationButton: React.ReactElement;
  expanded?: boolean;
  toggleExpanded?: () => void;
}

const useStyles = makeStyles((theme) => ({
  label: {
    marginLeft: theme.spacing(1),
    textAlign: 'initial',
    display: 'inline-block',
    overflowX: 'hidden',
  },
}));

export const IdeaOptions: React.FC<IdeaOptionsProps> = ({
  idea,
  ideaUrl,
  reviews,
  toggleReviewsOpen,
  configButton,
  navigationButton,
  expanded,
  toggleExpanded = () => {},
}) => {
  const theme = useTheme();

  const classes = useStyles();

  const ratingsCount = reviews.length;

  const totalRating =
    reviews.reduce((total, { rating }) => total + rating, 0) / ratingsCount;

  const averageRating = totalRating ? totalRating / ratingsCount : 0;

  const ratingConfig = {
    count: ratingsCount,
    average: averageRating,
  };

  const ratingTooltip = getRatingHelperText(ratingConfig);

  const buttonStyle = useIdeaOptionButtonStyle();

  return (
    <Box display="flex" alignItems="center" width="100%">
      <ShareMenu
        style={buttonStyle}
        shareCount={idea.sharedBy.length}
        url={ideaUrl}
      />
      <Tooltip placement="top" title={ratingTooltip}>
        <Button
          style={{
            ...buttonStyle,
            color: theme.palette.action.active,
          }}
          endIcon={<StarRate style={{ color: starColor }} />}
          onClick={toggleReviewsOpen}
        >
          {averageRating}
        </Button>
      </Tooltip>
      {configButton}
      {navigationButton}
      <Tooltip placement="top" title={idea.name}>
        <Button
          style={{
            ...buttonStyle,
            textTransform: 'capitalize',
            fontWeight: 400,
            flexGrow: 1,
          }}
          classes={{
            label: classes.label,
          }}
          onClick={toggleExpanded}
        >
          <Box display="flex" alignItems="center">
            <Box
              flex={1}
              textOverflow={'ellipsis'}
              whiteSpace={'nowrap'}
              overflow={'hidden'}
            >
              {idea.name}
            </Box>
            {!isNil(expanded) && (
              <Hidden xsDown>
                <Icon color={'action'} style={{ display: 'flex' }}>
                  {expanded ? <ExpandLess /> : <ExpandMore />}
                </Icon>
              </Hidden>
            )}
          </Box>
        </Button>
      </Tooltip>
    </Box>
  );
};
