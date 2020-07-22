import { Box, Tab, Tabs, Tooltip, useTheme } from '@material-ui/core';
import {
  CloudOff,
  Publish,
  RateReview,
  Share,
  StarRate,
} from '@material-ui/icons';
import { useBoolean } from 'ahooks';
import {
  ExportReviews,
  ReviewDialog,
  ReviewsDialog,
  ShareMenu,
} from 'containers';
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
import { ideaTabsShadowVariant, tabChildStyle, withStarColor } from 'styles';
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
        variant={'fullWidth'}
      >
        <BackToIdeas classes={classes} />
        <Tab
          ref={shareButtonRef}
          classes={classes}
          label={
            <Tooltip title={shareCountHelperText}>
              <Box style={tabChildStyle} onClick={setShareMenuOpen.setTrue}>
                {shareCount}
                &nbsp;
                <Share fontSize={'small'} color={'primary'} />
              </Box>
            </Tooltip>
          }
        />
        <Tab
          classes={classes}
          label={
            <Tooltip title={ratingTooltip}>
              <Box style={tabChildStyle} onClick={setReviewsOpen.setTrue}>
                {roundedAverage}
                &nbsp;
                <StarRate style={withStarColor} />
              </Box>
            </Tooltip>
          }
        />
        <Tab
          classes={classes}
          label={
            isAuthor ? (
              idea.status === 'sprout' ? (
                <Tooltip title={'Unpublish'}>
                  <Box style={tabChildStyle} onClick={unpublish}>
                    <CloudOff fontSize={'small'} color={'action'} />
                  </Box>
                </Tooltip>
              ) : (
                <Tooltip title={'Publish'}>
                  <Box style={tabChildStyle} onClick={publish}>
                    <Publish color={'primary'} />
                  </Box>
                </Tooltip>
              )
            ) : (
              <Tooltip title={'Review'}>
                <Box style={tabChildStyle} onClick={setReviewOpen.setTrue}>
                  <RateReview color="primary" />
                </Box>
              </Tooltip>
            )
          }
        />
        <ExportReviews ideaId={idea.id} classes={classes} />
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