import { Box, Button, Tooltip, useTheme } from '@material-ui/core';
import { KeyboardArrowLeft } from '@material-ui/icons';
import { ReviewButton } from 'components';
import { Idea, ReviewDialog, ReviewsDialog } from 'containers';
import 'firebase/firestore';
import { IdeaModel, Review } from 'models';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  useFirestoreCollection,
  useFirestoreDoc,
  useIdeasRef,
  useIdeaUrl,
  useReviewDialogs,
  useReviewsRef,
  useSignedInUser,
} from 'services';
import { pageMargin } from 'styles';
import { absolutePrivateRoute } from 'utils';
import { IdeaOptions } from './Options';

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

  return (
    <Box mt={pageMargin + 3} mb={10}>
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
            <Tooltip placement="top" title="Open in full">
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
      <Box pt={1} pb={3}>
        <Idea {...idea} />
      </Box>
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
  );
};
