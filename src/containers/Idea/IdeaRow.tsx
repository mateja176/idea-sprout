import { Box, Collapse, ListItem } from '@material-ui/core';
import { useBoolean } from 'ahooks';
import { IdeaOptions, ReviewDialog, ReviewsDialog } from 'containers';
import { IdeaModel, Review, User } from 'models';
import React from 'react';
import { useUser } from 'reactfire';
import { useFirestoreCollection, useIdeaUrl, useReviewsRef } from 'services';
import { Idea } from './Idea';

export interface IdeaRowProps {
  idea: IdeaModel;
}

export const IdeaRow: React.FC<IdeaRowProps> = ({ idea }) => {
  const user = useUser<User>();

  const [expanded, setExpanded] = useBoolean(false);
  const toggleExpanded = () => {
    setExpanded.toggle();
  };

  const ideaUrl = useIdeaUrl(idea.id);

  const reviews = useFirestoreCollection<Review>(useReviewsRef(idea.id));

  const [reviewOpen, setReviewOpen] = useBoolean(false);
  const toggleReviewOpen = () => {
    setExpanded.toggle();

    setReviewOpen.toggle();
  };

  const [reviewsOpen, setReviewsOpen] = useBoolean(false);
  const toggleReviewsOpen = () => {
    setReviewsOpen.toggle();
  };

  return (
    <Box key={idea.id}>
      <ListItem key={idea.id}>
        <IdeaOptions
          idea={idea}
          ideaUrl={ideaUrl}
          reviews={reviews}
          expanded
          toggleExpanded={toggleExpanded}
          toggleReviewsOpen={toggleReviewsOpen}
          toggleReviewOpen={toggleReviewOpen}
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
        review={reviews.find(({ id }) => id === user.uid) || null}
        open={reviewOpen}
        onClose={toggleReviewOpen}
      />
    </Box>
  );
};
