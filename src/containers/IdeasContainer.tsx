import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
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
  OpenInBrowser,
  RateReview,
  StarRate,
} from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
import { Idea } from 'components';
import firebase from 'firebase/app';
import { IdeaModel, RawIdea } from 'models';
import React from 'react';
import Draggable from 'react-draggable';
import { useHistory } from 'react-router-dom';
import { useFirestore, useFirestoreCollection } from 'reactfire';
import urljoin from 'url-join';
import { absolutePrivateRoute } from 'utils';

export interface IdeasContainerProps {}

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

export const IdeasContainer: React.FC<IdeasContainerProps> = () => {
  const ideasRef = useFirestore().collection('ideas');

  const ideasSnapshot = (useFirestoreCollection<RawIdea>(
    ideasRef,
  ) as unknown) as firebase.firestore.QuerySnapshot<RawIdea>;
  const ideas: IdeaModel[] = ideasSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

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

  return (
    <Box>
      <List>
        {ideas.map((idea) => (
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
                    <Box display="flex">
                      <Typography color="textSecondary">
                        {idea.rating.average} / {idea.rating.total}
                      </Typography>
                      <StarRate style={{ color: '#FFB400' }} />
                    </Box>
                  </Tooltip>
                  <Tooltip placement="top" title="Open in full">
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
                  <Rating
                    name="rating"
                    value={idea.rating.average}
                    precision={0.5}
                  />
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
        ))}
      </List>
    </Box>
  );
};
