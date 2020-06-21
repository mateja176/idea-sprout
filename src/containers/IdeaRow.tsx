import {
  Badge,
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
  makeStyles,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {
  DragIndicator,
  ExpandLess,
  ExpandMore,
  Link,
  OpenInBrowser,
  RateReview,
  Share,
  StarRate,
} from '@material-ui/icons';
import { Rating, SpeedDial, SpeedDialAction } from '@material-ui/lab';
import { DraggablePaper } from 'components';
import { IdeaModel } from 'models';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useHistory } from 'react-router-dom';
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  ViberIcon,
  ViberShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';
import { createQueueSnackbar, useActions } from 'services';
import { speedDialZIndex } from 'styles';
import urljoin from 'url-join';
import { absolutePrivateRoute } from 'utils';
import { Idea } from './Idea';

export interface IdeaRowProps {
  i: number;
  idea: IdeaModel;
}

const dragHandleId = 'drag-handle';

const iconSize = 48;

const getZIndex = (i: number) => speedDialZIndex - i;

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: getZIndex,
  },
  fab: {
    color: theme.palette.primary.main,
  },
  actions: {
    position: 'absolute',
    marginTop: '0 !important',
    zIndex: getZIndex,
  },
  badge: {
    zIndex: getZIndex,
  },
}));

export const IdeaRow: React.FC<IdeaRowProps> = ({ i, idea }) => {
  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const classes = useStyles(i);

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

  const [shareOptionsOpen, setShareOptionsOpen] = React.useState(false);

  const [origin, setOrigin] = React.useState('');
  React.useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const ideaLink = urljoin(origin, idea.id);

  const handleIconClick: React.MouseEventHandler = (e) => {
    e.stopPropagation();
  };

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
                <StarRate style={{ color: '#FFB400' }} />
              </Box>
            </Tooltip>
            <Tooltip
              placement="top"
              title={`Unique share count is ${idea.shareCount}`}
            >
              <Badge
                badgeContent={idea.shareCount}
                color="secondary"
                classes={{
                  badge: classes.badge,
                }}
                showZero
              >
                <SpeedDial
                  ariaLabel="Share options"
                  icon={<Share fontSize="small" />}
                  open={shareOptionsOpen}
                  direction="down"
                  onMouseEnter={() => setShareOptionsOpen(true)}
                  onMouseLeave={() => setShareOptionsOpen(false)}
                  FabProps={{
                    size: 'small',
                    color: 'default',
                  }}
                  classes={{
                    root: classes.root,
                    fab: classes.fab,
                    actions: classes.actions,
                  }}
                >
                  <SpeedDialAction
                    tooltipTitle="Copy link"
                    onClick={handleIconClick}
                    icon={
                      <CopyToClipboard
                        text={ideaLink}
                        onCopy={() => {
                          queueSnackbar({
                            severity: 'info',
                            message: 'Link to idea copied',
                          });
                        }}
                      >
                        <Link />
                      </CopyToClipboard>
                    }
                  />
                  <SpeedDialAction
                    tooltipTitle="Share on Facebook"
                    onClick={handleIconClick}
                    icon={
                      <FacebookShareButton url={ideaLink}>
                        <FacebookIcon size={iconSize} round />
                      </FacebookShareButton>
                    }
                  />
                  <SpeedDialAction
                    tooltipTitle="Share on Twitter"
                    onClick={handleIconClick}
                    icon={
                      <TwitterShareButton url={ideaLink}>
                        <TwitterIcon size={iconSize} round />
                      </TwitterShareButton>
                    }
                  />
                  <SpeedDialAction
                    tooltipTitle="Share on Linkedin"
                    onClick={handleIconClick}
                    icon={
                      <LinkedinShareButton url={ideaLink}>
                        <LinkedinIcon size={iconSize} round />
                      </LinkedinShareButton>
                    }
                  />
                  <SpeedDialAction
                    tooltipTitle="Share on Whatsapp"
                    onClick={handleIconClick}
                    icon={
                      <WhatsappShareButton url={ideaLink}>
                        <WhatsappIcon size={iconSize} round />
                      </WhatsappShareButton>
                    }
                  />
                  <SpeedDialAction
                    tooltipTitle="Share on Viber"
                    onClick={handleIconClick}
                    icon={
                      <ViberShareButton url={ideaLink}>
                        <ViberIcon size={iconSize} round />
                      </ViberShareButton>
                    }
                  />
                </SpeedDial>
              </Badge>
            </Tooltip>
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
        <Idea {...idea} />
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
