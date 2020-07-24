import {
  Box,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useTheme,
} from '@material-ui/core';
import {
  CloudOff,
  Publish,
  RateReview,
  Share,
  StarRate,
} from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { useBoolean } from 'ahooks';
import { ReviewDialog, ReviewsDialog, ShareMenu } from 'containers';
import { IdeaModel, User } from 'models';
import React from 'react';
import { StorageImage } from 'reactfire';
import {
  createAddIdea,
  createDeleteIdea,
  useActions,
  useIdeaTabStyles,
  useIdeaUrl,
  useShareIdea,
  useUpdateWithCount,
} from 'services';
import {
  ideaTabsShadowVariant,
  tabChildStyle,
  withStarColor,
  logoBorderRadius,
} from 'styles';
import { getRatingTooltip, getShareCountHelperText, roundAverage } from 'utils';
import { BackToIdeas } from './BackToIdeas';
import { ExportReviewSuspender } from './Review/ExportReviewSuspender';

const logoHeight = 40;
const logoMargin = 2;
const titleSectionMarginBottom = 5;
const titleSectionHeight =
  logoHeight + 2 * logoMargin + titleSectionMarginBottom;

const imageStyle: React.CSSProperties = { borderRadius: logoBorderRadius };

export const IdeaTabs: React.FC<{
  user: User;
  idea: IdeaModel;
  showName: boolean;
}> = ({ user, idea, showName }) => {
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
    <Box boxShadow={showName ? theme.shadows[ideaTabsShadowVariant] : 'none'}>
      <Tabs
        value={false}
        style={{
          boxShadow: showName ? 'none' : theme.shadows[ideaTabsShadowVariant],
        }}
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
        <ExportReviewSuspender
          idea={idea}
          uid={user.uid}
          email={user.email}
          isAuthor={isAuthor}
          classes={classes}
        />
      </Tabs>
      <Box
        height={titleSectionHeight}
        mb={titleSectionMarginBottom.toString().concat('px')}
        position={'absolute'}
        width={'100%'}
        bgcolor={showName ? 'white' : 'transparent'}
        zIndex={2}
        style={{
          transition: 'background 300ms ease-in-out',
        }}
      >
        <Box
          mx={3}
          display={'flex'}
          alignItems={'center'}
          height={showName ? '100%' : 0}
          overflow={'hidden'}
          style={{ transition: 'height 300ms ease-in-out' }}
        >
          <Typography variant={'h4'}>{idea.name}</Typography>
          <Box mt={'2px'} ml={2}>
            <React.Suspense
              fallback={
                <Skeleton
                  variant={'circle'}
                  width={logoHeight}
                  height={logoHeight}
                />
              }
            >
              <StorageImage
                style={imageStyle}
                storagePath={idea.logo.path}
                width={logoHeight}
                height={logoHeight}
              />
            </React.Suspense>
          </Box>
        </Box>
      </Box>
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
        onClose={setReviewOpen.setFalse}
      />
    </Box>
  );
};
