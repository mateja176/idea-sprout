import {
  Badge,
  Box,
  Button,
  Collapse,
  Hidden,
  Icon,
  ListItem,
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
import { useBoolean } from 'ahooks';
import { ButtonGroup, ReviewDialog } from 'containers';
import { IdeaModel, Review } from 'models';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useFirestoreCollectionData } from 'reactfire';
import { useIdeaUrl, useReviewsRef } from 'services';
import { starColor } from 'styles';
import urljoin from 'url-join';
import { absolutePrivateRoute, getRatingHelperText } from 'utils';
import { ShareMenu } from '../ShareMenu';
import { Idea } from './Idea';

export interface IdeaRowProps {
  idea: IdeaModel;
}

const useStyles = makeStyles((theme) => ({
  label: {
    marginLeft: theme.spacing(1),
    textAlign: 'initial',
    display: 'inline-block',
    overflowX: 'hidden',
  },
}));

export const IdeaRow: React.FC<IdeaRowProps> = ({ idea }) => {
  const theme = useTheme();

  const classes = useStyles();

  const [expanded, setExpanded] = useBoolean(false);

  const history = useHistory();

  const ideaUrl = useIdeaUrl(idea.id);

  const reviews = useFirestoreCollectionData<Review>(
    useReviewsRef({ id: idea.id }),
  );

  const ratingsCount = reviews.length;

  const averageRating =
    reviews.reduce((total, { rating }) => total + rating, 0) / ratingsCount;

  const ratingConfig = {
    count: ratingsCount,
    average: averageRating,
  };

  const ratingTooltip = getRatingHelperText(ratingConfig);

  const [reviewOpen, setReviewOpen] = useBoolean(false);
  const toggleReviewOpen = () => {
    setExpanded.setTrue();

    setReviewOpen.toggle();
  };

  return (
    <Box key={idea.id}>
      <ListItem key={idea.id}>
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
                    onClick={() => {
                      setExpanded.toggle();
                    }}
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
      </ListItem>
      <Collapse in={expanded} timeout="auto" mountOnEnter>
        <Box mb={3}>
          <Idea {...idea} />
        </Box>
      </Collapse>
      <ReviewDialog
        idea={idea}
        ideaUrl={ideaUrl}
        open={reviewOpen}
        toggleOpen={toggleReviewOpen}
      />
    </Box>
  );
};
