import { Box } from '@material-ui/core';
import { Idea, ReviewDialog, ReviewsDialog } from 'containers';
import 'firebase/firestore';
import { IdeaModel, Review, User } from 'models';
import React from 'react';
import { useUser } from 'reactfire';
import {
  useFirestoreCollection,
  useFirestoreDoc,
  useIdeasRef,
  useIdeaUrl,
  useReviewDialogs,
  useReviewsRef,
} from 'services';
import { pageMargin } from 'styles';
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
  const user = useUser<User>();

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

  const reviewDialogs = useReviewDialogs();
  const {
    reviewOpen,
    reviewsOpen,
    toggleReviewOpen,
    toggleReviewsOpen,
  } = reviewDialogs;

  return (
    <Box mt={pageMargin + 3} mb={10}>
      <Box mx={2}>
        <IdeaOptions
          idea={idea}
          ideaUrl={ideaUrl}
          reviews={reviews}
          {...reviewDialogs}
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
