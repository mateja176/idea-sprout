import { Box, Tab, Tabs, Tooltip, useTheme } from '@material-ui/core';
import {
  CloudOff,
  CloudUpload,
  RateReview,
  Share,
  StarRate,
} from '@material-ui/icons';
import { useBoolean } from 'ahooks';
import { ReviewDialog, ReviewsDialog, ShareMenu } from 'containers';
import { IdeaModel, User } from 'models';
import React from 'react';
import {
  createAddIdea,
  createDeleteIdea,
  useActions,
  useIdeaTabStyles,
  useIdeaUrl,
  useShareIdea,
  useUpdateWithCount,
} from 'services';
import { ideaTabsShadowVariant, withStarColor } from 'styles';
import { getRatingTooltip, getShareCountHelperText, roundAverage } from 'utils';
import { BackToIdeas } from './BackToIdeas';

export const IdeaTabs: React.FC<{ user: User; idea: IdeaModel }> = ({
  user,
  idea,
}) => {
  const theme = useTheme();
  const { addIdea, deleteIdea } = useActions({
    addIdea: createAddIdea,
    deleteIdea: createDeleteIdea,
  });

  const shareCount = Object.keys(idea.sharedBy).length;

  const ideaUrl = useIdeaUrl(idea.id);
  const shareIdea = useShareIdea(idea);

  const [shareMenuOpen, setShareMenuOpen] = useBoolean();

  const classes = useIdeaTabStyles();

  const shareCountHelperText = getShareCountHelperText(shareCount);

  const ratingTooltip = getRatingTooltip(idea.ratingCount, idea.ratingCount);
  const roundedAverage = roundAverage(idea.averageRating);

  const shareButtonRef = React.useRef<HTMLDivElement | null>(null);

  const [reviewsOpen, setReviewsOpen] = useBoolean();

  const isAuthor = user.uid === idea.author;

  const updateWithCount = useUpdateWithCount(idea.id);

  const publish = React.useCallback(() => {
    const withStatus = { status: 'sprout' } as const;
    updateWithCount({ count: 1, ...withStatus }).then(() => {
      addIdea({ ...idea, ...withStatus });
    });
  }, [updateWithCount, addIdea, idea]);

  const unpublish = React.useCallback(() => {
    updateWithCount({ count: -1, status: 'seed' }).then(() => {
      deleteIdea({ id: idea.id });
    });
  }, [updateWithCount, deleteIdea, idea.id]);

  const [reviewOpen, setReviewOpen] = useBoolean();

  return (
    <>
      <Tabs
        value={false}
        style={{ boxShadow: theme.shadows[ideaTabsShadowVariant] }}
      >
        <BackToIdeas classes={classes} />
        <Tab
          classes={classes}
          label={
            <Tooltip title={shareCountHelperText}>
              <div
                ref={shareButtonRef}
                style={{ display: 'flex' }}
                onClick={setShareMenuOpen.setTrue}
              >
                {shareCount}
                &nbsp;
                <Share fontSize={'small'} color={'primary'} />
              </div>
            </Tooltip>
          }
        />
        <Tab
          classes={classes}
          label={
            <Tooltip title={ratingTooltip}>
              <Box display={'flex'} onClick={setReviewsOpen.setTrue}>
                {roundedAverage}
                &nbsp;
                <StarRate style={withStarColor} />
              </Box>
            </Tooltip>
          }
        />
        <Tab
          classes={classes}
          style={{ flex: 1 }}
          label={
            isAuthor ? (
              idea.status === 'sprout' ? (
                <Box display={'flex'} onClick={unpublish}>
                  <CloudOff fontSize={'small'} color={'action'} />
                  &nbsp;Unpublish
                </Box>
              ) : (
                <Box display={'flex'} onClick={publish}>
                  <CloudUpload color={'primary'} />
                  &nbsp; Publish
                </Box>
              )
            ) : (
              <Box display={'flex'} onClick={setReviewOpen.setTrue}>
                <RateReview color="primary" />
                &nbsp;
                {roundedAverage}
              </Box>
            )
          }
        />
      </Tabs>
      <ShareMenu
        anchorEl={shareButtonRef.current}
        open={shareMenuOpen}
        onClose={setShareMenuOpen.setFalse}
        url={ideaUrl}
        shareIdea={shareIdea}
      />
      <ReviewsDialog
        id={idea.id}
        name={idea.name}
        count={idea.ratingCount}
        open={reviewsOpen}
        onClose={setReviewsOpen.setFalse}
      />
      <ReviewDialog
        uid={user.uid}
        idea={idea}
        ideaUrl={ideaUrl}
        open={reviewOpen}
        onClose={setReviewsOpen.setFalse}
      />
    </>
  );
};
