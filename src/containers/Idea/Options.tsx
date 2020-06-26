import {
  Badge,
  Box,
  Button,
  Hidden,
  Icon,
  makeStyles,
  Tooltip,
  useTheme,
} from '@material-ui/core';
import {
  ExpandLess,
  ExpandMore,
  OpenInBrowser,
  RateReview,
  StarRate,
} from '@material-ui/icons';
import { ButtonGroup, ShareMenu } from 'containers';
import { IdeaModel, Review } from 'models';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { starColor } from 'styles';
import urljoin from 'url-join';
import { absolutePrivateRoute, getRatingHelperText } from 'utils';

export interface IdeaOptionsProps {
  idea: IdeaModel;
  ideaUrl: string;
  reviews: Review[];
  expanded: boolean;
  toggleExpanded: () => void;
  toggleReviewsOpen: () => void;
  toggleReviewOpen: () => void;
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
  expanded,
  toggleExpanded,
  toggleReviewsOpen,
  toggleReviewOpen,
}) => {
  const theme = useTheme();

  const classes = useStyles();

  const history = useHistory();

  const ratingsCount = reviews.length;

  const averageRating =
    reviews.reduce((total, { rating }) => total + rating, 0) / ratingsCount;

  const ratingConfig = {
    count: ratingsCount,
    average: averageRating,
  };

  const ratingTooltip = getRatingHelperText(ratingConfig);

  return (
    <Box display="flex" alignItems="center" my={1} width="100%">
      <ButtonGroup>
        {({ firstStyle, style, lastStyle }) => (
          <>
            <Badge
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              color="primary"
              badgeContent={idea.sharedBy.length}
            >
              <ShareMenu
                style={firstStyle}
                shareCount={idea.sharedBy.length}
                url={ideaUrl}
              />
            </Badge>
            <Tooltip placement="top" title={ratingTooltip}>
              <Button
                style={{
                  ...style,
                  color: theme.palette.action.active,
                }}
                endIcon={<StarRate style={{ color: starColor }} />}
                onClick={toggleReviewsOpen}
              >
                {averageRating}
              </Button>
            </Tooltip>
            <Tooltip title="Review" placement="top">
              <Button style={style} onClick={toggleReviewOpen}>
                <RateReview color="primary" />
              </Button>
            </Tooltip>
            <Tooltip placement="top" title="Open in full">
              <Button
                style={{ ...style, color: theme.palette.action.active }}
                onClick={() => {
                  history.push(
                    urljoin(absolutePrivateRoute.ideas.path, idea.id),
                    idea,
                  );
                }}
              >
                <OpenInBrowser />
              </Button>
            </Tooltip>
            <Tooltip placement="top" title={idea.name}>
              <Button
                style={{
                  ...lastStyle,
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
                  <Hidden xsDown>
                    <Icon color={'action'} style={{ display: 'flex' }}>
                      {expanded ? <ExpandLess /> : <ExpandMore />}
                    </Icon>
                  </Hidden>
                </Box>
              </Button>
            </Tooltip>
          </>
        )}
      </ButtonGroup>
    </Box>
  );
};
