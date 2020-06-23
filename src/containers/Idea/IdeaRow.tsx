import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
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
import { Share } from 'containers';
import { IdeaModel } from 'models';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { starColor } from 'styles';
import urljoin from 'url-join';
import { absolutePrivateRoute } from 'utils';
import { Idea } from './Idea';

export interface IdeaRowProps {
  i: number;
  idea: IdeaModel;
}

const dragHandleId = 'drag-handle';

export const IdeaRow: React.FC<IdeaRowProps> = ({ i, idea }) => {
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

  const history = useHistory();

  const [origin, setOrigin] = React.useState('');
  React.useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const ideaUrl = urljoin(origin, idea.id);

  return (
    <Box key={idea.id}>
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
              <Box display="flex" mr={1}>
                <Typography
                  color="textSecondary"
                  style={{ minWidth: 40, textAlign: 'center' }}
                >
                  {idea.rating.average}/{idea.rating.total}
                </Typography>
                <StarRate style={{ color: starColor }} />
              </Box>
            </Tooltip>
            <Share i={i} shareCount={idea.shareCount} url={ideaUrl} />
            <Tooltip placement="top" title="Open in full">
              <Box ml={1}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();

                    history.push(
                      urljoin(absolutePrivateRoute.ideas.path, idea.id),
                      idea,
                    );
                  }}
                >
                  <OpenInBrowser />
                </IconButton>
              </Box>
            </Tooltip>
            <Tooltip placement="top" title={idea.name}>
              <Box
                ml={1}
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
              >
                {idea.name}
              </Box>
            </Tooltip>
          </Box>
        </ListItemText>
        <ListItemSecondaryAction onClick={toggleExpanded}>
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </ListItemSecondaryAction>
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
            "{idea.name}" Review
            <Box ml="auto" id={dragHandleId}>
              <DragIndicator color="action" />
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Rating name="rating" value={idea.rating.average} precision={0.5} />
          </Box>
          <TextField
            required
            multiline
            rows={5}
            label="Feedback"
            helperText="What did you like or dislike about the idea? Your feedback directly shapes the course of the idea. ( 40 - )"
          ></TextField>
          <Box mt={4}>
            <Typography>
              Would you like to share the idea with a friend who might be
              interest in it?
            </Typography>
          </Box>
          {/* TODO add share section */}
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
  );
};
