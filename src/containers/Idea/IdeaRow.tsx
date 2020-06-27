import {
  Box,
  Button,
  Collapse,
  ListItem,
  Tooltip,
  useTheme,
} from '@material-ui/core';
import { CloudOff, CloudUpload, Edit, OpenInBrowser } from '@material-ui/icons';
import { useBoolean } from 'ahooks';
import { Link, ReviewButton } from 'components';
import { IdeaOptions, ReviewDialog, ReviewsDialog } from 'containers';
import { IdeaModel, Review } from 'models';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  useFirestoreCollection,
  useIdeasRef,
  useIdeaUrl,
  useReviewDialogs,
  useReviewsRef,
  useSignedInUser,
} from 'services';
import urljoin from 'url-join';
import { absolutePrivateRoute } from 'utils';
import { Idea } from './Idea';

export interface IdeaRowProps {
  idea: IdeaModel;
  isAuthor: boolean;
}

export const IdeaRow: React.FC<IdeaRowProps> = ({ idea, isAuthor }) => {
  const theme = useTheme();

  const history = useHistory();

  const user = useSignedInUser();

  const ideaRef = useIdeasRef().doc(idea.id);

  const [expanded, setExpanded] = useBoolean();
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
    setExpanded.setTrue();

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
          ConfigButton={({ style }) =>
            isAuthor ? (
              <Tooltip placement="top" title="Edit Idea">
                <Link
                  to={urljoin(
                    absolutePrivateRoute.ideas.children.edit.path,
                    idea.id,
                  )}
                >
                  <Button style={style} color="primary">
                    <Edit />
                  </Button>
                </Link>
              </Tooltip>
            ) : (
              <ReviewButton style={style} onClick={toggleReviewAndExpanded} />
            )
          }
          NavigationButton={({ style }) => {
            const buttonStyle = {
              ...style,
              color: theme.palette.action.active,
            };

            return isAuthor ? (
              idea.status === 'sprout' ? (
                <Tooltip placement={'top'} title={'Unpublish'}>
                  <Button
                    style={buttonStyle}
                    onClick={() => {
                      const withStatus: Pick<IdeaModel, 'status'> = {
                        status: 'seed',
                      };
                      ideaRef.update(withStatus);
                    }}
                  >
                    <CloudOff />
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip placement={'top'} title={'Publish'}>
                  <Button
                    style={buttonStyle}
                    onClick={() => {
                      const withStatus: Pick<IdeaModel, 'status'> = {
                        status: 'sprout',
                      };
                      ideaRef.update(withStatus);
                    }}
                  >
                    <CloudUpload />
                  </Button>
                </Tooltip>
              )
            ) : (
              <Tooltip placement={'top'} title={'Open in full'}>
                <Button
                  style={buttonStyle}
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
            );
          }}
          expanded={expanded}
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
