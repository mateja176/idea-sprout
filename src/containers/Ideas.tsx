import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  PaperProps,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {
  DragIndicator,
  ExpandLess,
  ExpandMore,
  OpenInNew,
  RateReview,
  StarRate,
} from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
import { Link } from 'components';
import { Idea } from 'containers';
import { IdeaModel } from 'models';
import React from 'react';
import Draggable from 'react-draggable';
import urljoin from 'url-join';
import { absolutePrivateRoute } from 'utils';

export interface IdeasProps {}

const dragHandleId = 'drag-handle';

const PaperComponent: React.FC<PaperProps> = (props) => {
  return (
    <Draggable
      handle=".MuiDialogTitle-root"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
};

export const Ideas: React.FC<IdeasProps> = () => {
  const ideas: IdeaModel[] = [
    {
      id: 'dF6lqaZgkEWWj9qWNuiy',
      author: 'mateja176@gmail.com',
      status: 'draft',
      rating: {
        average: 0,
        total: 0,
      },
      checks: {
        niche: true,
        expectations: true,
      },
      name: 'Test',
      storyURL: 'videos/SpaceX-preview.mp4',
      problemSolution:
        'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
      imageURLs: ['images/idea-sprout.png'],
      rationale:
        'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
      shareCount: 1,
    },
  ];

  const [expanded, setExpended] = React.useState(false);
  const toggleExpanded = () => {
    setExpended(!expanded);
  };

  const [reviewOpen, setReviewOpen] = React.useState(false);
  const toggleReviewOpen: React.MouseEventHandler = (e) => {
    e.stopPropagation();

    setExpended(true);

    setReviewOpen(!reviewOpen);
  };

  return (
    <Box>
      <List>
        {ideas.map((idea) => (
          <Box>
            <ListItem key={idea.id} button onClick={toggleExpanded}>
              <ListItemIcon>
                <Tooltip title="Review" placement="top">
                  <IconButton onClick={toggleReviewOpen}>
                    <RateReview color="primary" />
                  </IconButton>
                </Tooltip>
              </ListItemIcon>
              <ListItemText>
                <Box display="flex" alignItems="center">
                  <Tooltip
                    placement="top"
                    title={`Average rating ${idea.rating.average} out of total ${idea.rating.total}`}
                  >
                    <Box display="flex">
                      <Typography color="textSecondary">
                        {idea.rating.average}
                      </Typography>
                      <StarRate style={{ color: '#FFB400' }} />
                    </Box>
                  </Tooltip>
                  <Tooltip placement="top" title="Open in new tab">
                    <Link
                      to={urljoin(absolutePrivateRoute.idea.path, idea.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      target="__blank"
                    >
                      <IconButton>
                        <OpenInNew />
                      </IconButton>
                    </Link>
                  </Tooltip>
                  <Box ml={1}>{idea.name}</Box>
                </Box>
              </ListItemText>
              <ListItemSecondaryAction onClick={toggleExpanded}>
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </ListItemSecondaryAction>
            </ListItem>
            <Collapse in={expanded} timeout="auto" mountOnEnter>
              <Idea {...idea} />
            </Collapse>
            <Dialog // TODO replace modal with custom implementation since elements outside of the dialog cannot be interacted with
              open={reviewOpen}
              onClose={toggleReviewOpen}
              hideBackdrop
              PaperComponent={PaperComponent}
            >
              <DialogTitle style={{ cursor: 'grab' }}>
                <Box display="flex" alignItems="center">
                  "{idea.name}" Review
                  <Box ml="auto" id={dragHandleId}>
                    <DragIndicator color="action" />
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Box mb={2}>
                  <Rating value={idea.rating.average} precision={0.5} />
                </Box>
                <DialogContentText>
                  <TextField
                    required
                    multiline
                    rows={5}
                    label="Feedback"
                    helperText="What did you like or dislike about the idea? Your feedback directly shapes the course of the idea. ( 40 - )"
                  ></TextField>
                  <Box mt={4}>
                    <Typography>
                      Would you like to share the idea with a friend who might
                      be interest in it?
                    </Typography>
                  </Box>
                  {/* TODO add share section */}
                </DialogContentText>
                <DialogActions>
                  <Button
                    onClick={() => {
                      setReviewOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Submit</Button>
                </DialogActions>
              </DialogContent>
            </Dialog>
          </Box>
        ))}
      </List>
    </Box>
  );
};
