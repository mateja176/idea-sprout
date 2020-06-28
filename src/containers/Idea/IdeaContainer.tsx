import { Box, Button, Tooltip, useTheme } from '@material-ui/core';
import { KeyboardArrowLeft } from '@material-ui/icons';
import { ReviewButton } from 'components';
import { Idea, ReviewDialog, ReviewsDialog } from 'containers';
import 'firebase/firestore';
import { IdeaModel, Review } from 'models';
import React from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import {
  useFirestoreCollection,
  useFirestoreDoc,
  useIdeasRef,
  useIdeaUrl,
  useReviewDialogs,
  useReviewsRef,
  useSignedInUser,
} from 'services';
import { ideaMarginBottom, pageMargin } from 'styles';
import { absolutePrivateRoute } from 'utils';
import { IdeaOptions } from './IdeaOptions';

export interface IdeaContainerProps extends Pick<IdeaModel, 'id'> {
  initialIdea?: IdeaModel;
  initialReviews?: Review[];
}

export const IdeaContainer: React.FC<IdeaContainerProps> = ({
  id,
  initialIdea,
  initialReviews,
}) => {
  const theme = useTheme();

  const history = useHistory();

  const user = useSignedInUser();

  const ideasRef = useIdeasRef();

  const ideaRef = ideasRef.doc(id);

  const idea = useFirestoreDoc<IdeaModel>(ideaRef, {
    startWithValue: initialIdea,
  });

  const reviewsRef = useReviewsRef(idea.id);

  const reviews = useFirestoreCollection<Review>(reviewsRef, {
    startWithValue: initialReviews,
  });

  const ideaUrl = useIdeaUrl(idea.id);

  const {
    reviewOpen,
    reviewsOpen,
    toggleReviewOpen,
    toggleReviewsOpen,
  } = useReviewDialogs();

  return idea.name ? (
    <Box mt={pageMargin} mb={ideaMarginBottom}>
      <Box mx={2}>
        <IdeaOptions
          idea={idea}
          ideaUrl={ideaUrl}
          reviews={reviews}
          toggleReviewsOpen={toggleReviewOpen}
          ConfigButton={({ style }) => (
            <ReviewButton style={style} onClick={toggleReviewOpen} />
          )}
          NavigationButton={({ style }) => (
            <Tooltip placement="top" title="Back to ideas">
              <Button
                style={{ ...style, color: theme.palette.action.active }}
                onClick={() => {
                  history.push(absolutePrivateRoute.ideas.path);
                }}
              >
                <KeyboardArrowLeft />
              </Button>
            </Tooltip>
          )}
        />
      </Box>
      <Idea {...idea} />
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
        onClose={toggleReviewOpen}
      />
    </Box>
  ) : (
    <Redirect to={absolutePrivateRoute.ideas.path} />
  );
};
