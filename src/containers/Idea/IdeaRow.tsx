import {
  Box,
  Button,
  Collapse,
  ListItem,
  Tooltip,
  useTheme,
} from '@material-ui/core';
import { OpenInBrowser } from '@material-ui/icons';
import { useBoolean } from 'ahooks';
import { IdeaOptions, ReviewDialog, ReviewsDialog } from 'containers';
import { IdeaModel, Review, User } from 'models';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useUser } from 'reactfire';
import {
  useFirestoreCollection,
  useIdeaUrl,
  useReviewDialogs,
  useReviewsRef,
} from 'services';
import urljoin from 'url-join';
import { absolutePrivateRoute } from 'utils';
import { Idea } from './Idea';

export interface IdeaRowProps {
  idea: IdeaModel;
}

export const IdeaRow: React.FC<IdeaRowProps> = ({ idea }) => {
  const theme = useTheme();

  const history = useHistory();

  const user = useUser<User>();

  const [expanded, setExpanded] = useBoolean(false);
  const toggleExpanded = () => {
    setExpanded.toggle();
  };

  const ideaUrl = useIdeaUrl(idea.id);

  const reviews = useFirestoreCollection<Review>(useReviewsRef(idea.id));

  const {
    reviewOpen,
    reviewsOpen,
    toggleReviewOpen,
    toggleReviewsOpen,
  } = useReviewDialogs();

  const toggleReviewAndExpanded = () => {
    toggleExpanded();

    toggleReviewOpen();
  };

  return (
    <Box key={idea.id}>
      <ListItem key={idea.id}>
        <IdeaOptions
          idea={idea}
          ideaUrl={ideaUrl}
          reviews={reviews}
          toggleReviewsOpen={toggleReviewsOpen}
          toggleReviewOpen={toggleReviewAndExpanded}
          NavigationButton={({ style }) => (
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
          )}
          expanded
          toggleExpanded={toggleExpanded}
        />
      </ListItem>
      <Collapse in={expanded} timeout="auto" mountOnEnter>
        <Box mb={3}>
          <Idea {...idea} />
        </Box>
      </Collapse>
      <ReviewsDialog
        name={idea.name}
        open={reviewsOpen}
        onClose={toggleReviewsOpen}
        reviews={reviews}
      />
      <ReviewDialog
        idea={idea}
        ideaUrl={ideaUrl}
        review={reviews.find(({ id }) => id === user.uid)}
        open={reviewOpen}
        onClose={toggleReviewAndExpanded}
      />
    </Box>
  );
};
