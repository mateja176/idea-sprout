import { Box, Button, Tooltip, useTheme } from '@material-ui/core';
import { KeyboardArrowLeft } from '@material-ui/icons';
import { IdeaOptionsWrapper, ReviewButton } from 'components';
import { Idea, ReviewDialog, ReviewsDialog } from 'containers';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { IdeaModel } from 'models';
import React from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import {
  useFirestoreDoc,
  useIdeaOptionButtonStyle,
  useIdeaUrl,
  useReviewDialogs,
  useReviewSubmit,
  useShareIdea,
  useSignedInUser,
} from 'services';
import { ideaMarginBottom, pageMargin } from 'styles';
import { absolutePrivateRoute, firestoreCollections } from 'utils';
import { IdeaOptions } from './IdeaOptions';

export interface IdeaContainerProps extends Pick<IdeaModel, 'id'> {
  initialIdea?: IdeaModel;
}

export const IdeaContainer: React.FC<IdeaContainerProps> = ({
  id,
  initialIdea,
}) => {
  const theme = useTheme();

  const history = useHistory();

  const user = useSignedInUser();

  const idea = useFirestoreDoc<IdeaModel>(
    firebase.firestore().collection(firestoreCollections.ideas.path).doc(id),
    {
      startWithValue: initialIdea,
    },
  );

  const submitReview = useReviewSubmit(idea.id);

  const shareIdea = useShareIdea(idea);

  const ideaUrl = useIdeaUrl(idea.id);

  const {
    reviewOpen,
    reviewsOpen,
    toggleReviewOpen,
    toggleReviewsOpen,
  } = useReviewDialogs();

  const buttonStyle = useIdeaOptionButtonStyle();

  return idea.name ? (
    <Box mt={pageMargin} mb={ideaMarginBottom}>
      <IdeaOptionsWrapper>
        <IdeaOptions
          idea={idea}
          ideaUrl={ideaUrl}
          toggleReviewsOpen={toggleReviewOpen}
          configButton={
            <ReviewButton style={buttonStyle} onClick={toggleReviewOpen} />
          }
          navigationButton={
            <Tooltip placement="top" title="Back to ideas">
              <Button
                style={{ ...buttonStyle, color: theme.palette.action.active }}
                onClick={() => {
                  history.push(absolutePrivateRoute.ideas.path);
                }}
              >
                <KeyboardArrowLeft />
              </Button>
            </Tooltip>
          }
        />
      </IdeaOptionsWrapper>
      <Idea {...idea} />
      <React.Suspense fallback={null}>
        <ReviewsDialog
          id={idea.id}
          name={idea.name}
          open={reviewsOpen}
          onClose={toggleReviewsOpen}
        />
      </React.Suspense>
      <React.Suspense fallback={null}>
        <ReviewDialog
          user={user}
          idea={idea}
          ideaUrl={ideaUrl}
          open={reviewOpen}
          onClose={toggleReviewOpen}
          onSubmit={submitReview}
          onShareWindowClose={shareIdea}
        />
      </React.Suspense>
    </Box>
  ) : (
    <Redirect to={absolutePrivateRoute.ideas.path} />
  );
};
