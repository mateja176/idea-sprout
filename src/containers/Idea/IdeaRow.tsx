import {
  Badge,
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Hidden,
  Icon,
  ListItem,
  makeStyles,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@material-ui/core';
import {
  DragIndicator,
  ExpandLess,
  ExpandMore,
  OpenInBrowser,
  RateReview,
  StarRate,
} from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
import { DraggablePaper } from 'components';
import { ButtonGroup, Check, shareConfigs } from 'containers';
import { useFormik } from 'formik';
import {
  createReviewSchema,
  CreationReview,
  FeedbackLength,
  IdeaModel,
  User,
} from 'models';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useUser } from 'reactfire';
import {
  createQueueSnackbar,
  useActions,
  useIdeaUrl,
  useReviews,
  useSubscriptions,
} from 'services';
import { starColor } from 'styles';
import urljoin from 'url-join';
import { absolutePrivateRoute } from 'utils';
import { ShareMenu } from '../ShareMenu';
import { Idea } from './Idea';

export interface IdeaRowProps {
  i: number;
  idea: IdeaModel;
}

const dragHandleId = 'drag-handle';

const useStyles = makeStyles((theme) => ({
  label: {
    marginLeft: theme.spacing(1),
    textAlign: 'initial',
    display: 'inline-block',
    overflowX: 'hidden',
  },
}));

export const IdeaRow: React.FC<IdeaRowProps> = ({ i, idea }) => {
  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const theme = useTheme();

  const classes = useStyles();

  const reviews = useReviews({ id: idea.id });
  const subscriptions = useSubscriptions();

  const user = useUser<User>();

  const initialValues: CreationReview = {
    rating: idea.rating.average,
    feedback: '',
    shared: false,
    doNotShare: false,
    subscribed: false,
  };

  const {
    handleSubmit,
    isSubmitting,
    getFieldProps,
    isValid,
    errors,
    touched,
    values,
  } = useFormik({
    validationSchema: createReviewSchema,
    initialValues,
    onSubmit: ({ rating, feedback, subscribed }) => {
      return Promise.all([
        reviews.doc(user.uid).set({ rating, feedback }),
        subscriptions.doc(idea.id).set({ subscribed: subscribed }),
      ])
        .then(() => {
          queueSnackbar({
            severity: 'success',
            message: 'Review submitted',
          });
          
          toggleReviewOpen();
        })
        .catch(() => {
          queueSnackbar({
            severity: 'error',
            message: 'Failed to submit, please retry',
          });
        });
    },
  });

  const [expanded, setExpended] = React.useState(false);
  const toggleExpanded = () => {
    setExpended(!expanded);
  };

  const [reviewOpen, setReviewOpen] = React.useState(false);
  const toggleReviewOpen = () => {
    setExpended(true);

    setReviewOpen(!reviewOpen);
  };

  const history = useHistory();

  const ideaUrl = useIdeaUrl(idea.id);

  const sharePrompt0 = (
    <span>
      Be the first one to share <i>{idea.name}</i>.
    </span>
  );

  const sharePrompt1 = (
    <span>
      <i>{idea.name}</i> has been shared by{' '}
      <span style={{ textDecoration: 'underline' }}>
        {idea.shareCount} {idea.shareCount > 1 ? 'people' : 'person'}
      </span>{' '}
      so far. Would you like to share it too?
    </span>
  );

  const ratingTooltip = `Average rating ${
    values.rating
      ? (idea.rating.average + values.rating) /
        (idea.rating.total === 0 ? 1 : 2)
      : idea.rating.average
  } out of total ${values.rating ? idea.rating.total + 1 : idea.rating.total}`;

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
                  badgeContent={idea.shareCount}
                >
                  <ShareMenu
                    style={firstStyle}
                    shareCount={idea.shareCount}
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
                    {idea.rating.average}
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
      </ListItem>
      <Collapse in={expanded} timeout="auto" mountOnEnter>
        <Box mb={3}>
          <Idea {...idea} />
        </Box>
      </Collapse>
      <Dialog // TODO replace modal with custom implementation since elements outside of the dialog cannot be interacted with
        open={reviewOpen}
        onClose={toggleReviewOpen}
        hideBackdrop
        PaperComponent={DraggablePaper}
      >
        <DialogTitle style={{ cursor: 'grab' }}>
          <Box display="flex" alignItems="center">
            <i>{idea.name}</i>&nbsp;Review
            <Box ml="auto" id={dragHandleId}>
              <DragIndicator color="action" />
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <Tooltip title={ratingTooltip}>
                <Rating {...getFieldProps('rating')} precision={0.5} />
              </Tooltip>
            </Box>
            <TextField
              {...getFieldProps('feedback')}
              required
              multiline
              rows={5}
              label="Feedback"
              helperText={`What did you like or dislike about the idea? Your feedback directly shapes the course of the idea. ( ${FeedbackLength.min} - )`}
            ></TextField>
            <Box mt={4}>
              <Typography>
                {idea.shareCount > 0 ? sharePrompt1 : sharePrompt0}
              </Typography>
              <Box mt={1} display="flex" flexWrap="wrap">
                {shareConfigs.map((config) => (
                  <Tooltip
                    key={config.label}
                    placement="top"
                    title={config.label}
                  >
                    <Box mr={1}>
                      <config.Button url={ideaUrl}>
                        <config.Icon size={50} />
                      </config.Button>
                    </Box>
                  </Tooltip>
                ))}
              </Box>
              <Check
                name="doNotShare"
                label="Do not share"
                description={
                  <Box>
                    <Box>
                      It's not required, however sharing the idea with a friend
                      or friends who may be interested in it, helps the idea
                      grow.
                    </Box>
                    <Box>
                      Ideas which are not shared are like plants which are not
                      watered, eventually they shrivel and die.
                    </Box>
                  </Box>
                }
                getFieldProps={getFieldProps}
                errorMessage={(touched.doNotShare || '') && errors.doNotShare}
              />
              <Check
                name="subscribed"
                label="Subscribe"
                description={
                  <Box>
                    <Box>
                      Is <i>{idea.name}</i> going to bloom or shrivel?
                    </Box>
                    <Box>
                      Subscribe to get exclusive updates about the growth of the
                      idea.
                    </Box>
                  </Box>
                }
                getFieldProps={getFieldProps}
                errorMessage={(touched.subscribed || '') && errors.doNotShare}
              />
            </Box>
            <DialogActions>
              <Button
                onClick={() => {
                  setReviewOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !isValid}>
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
