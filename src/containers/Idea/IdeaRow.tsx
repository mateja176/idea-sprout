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
import { ButtonGroup } from 'containers';
import { socialMediaConfigs } from 'containers/socialMedia';
import { IdeaModel } from 'models';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useIdeaUrl } from 'services';
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
  const theme = useTheme();

  const classes = useStyles();

  const [expanded, setExpended] = React.useState(false);
  const toggleExpanded = () => {
    setExpended(!expanded);
  };

  const [reviewOpen, setReviewOpen] = React.useState(false);
  const toggleReviewOpen: React.MouseEventHandler = (e) => {
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
                <Tooltip
                  placement="top"
                  title={`Average rating ${idea.rating.average} out of total ${idea.rating.total}`}
                >
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
              {idea.shareCount > 0 ? sharePrompt1 : sharePrompt0}
            </Typography>
            <Box mt={1} display="flex" flexWrap="wrap">
              {socialMediaConfigs.map((config) => (
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
          </Box>
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
