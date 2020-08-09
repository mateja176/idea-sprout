import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CloudOff from '@material-ui/icons/CloudOff';
import Publish from '@material-ui/icons/Publish';
import Share from '@material-ui/icons/Share';
import StarRate from '@material-ui/icons/StarRate';
import Skeleton from '@material-ui/lab/Skeleton';
import useBoolean from 'ahooks/es/useBoolean';
import { ShareMenu } from 'containers/Share';
import { User } from 'firebase/app';
import { IdeaModel } from 'models';
import React from 'react';
import { StorageImage } from 'reactfire';
import {
  createAddIdea,
  createDeleteIdea,
  useActions,
  useIdeaUrl,
  useShareIdea,
} from 'services';
import {
  ideaTabStyle,
  logoBorderRadius,
  tabChildStyle,
  tabsLogoHeight,
  tabsTitleSectionHeight,
  tabsTitleSectionPaddingBottom,
  withStarColor,
} from 'styles';
import { getRatingTooltip, getShareCountHelperText, roundAverage } from 'utils';
import { BackToIdeas } from './BackToIdeas';
import { IdeaProps } from './Idea';
import {
  ExportReviewSuspender,
  ReviewButtonSuspender,
  ReviewDialog,
  ReviewsDialog,
} from './Review';

const boxShadow = 'rgba(0, 0, 0, 0.2) 0px 5px 8px';

const imageStyle: React.CSSProperties = { borderRadius: logoBorderRadius };

const actionCreators = {
  addIdea: createAddIdea,
  deleteIdea: createDeleteIdea,
};

export const IdeaTabs: React.FC<
  {
    user: User;
    idea: IdeaModel;
    showName: boolean;
  } & Pick<IdeaProps, 'update'>
> = ({ user, idea, showName, update }) => {
  const { addIdea, deleteIdea } = useActions(actionCreators);

  const shareCount = Object.keys(idea.sharedBy).length;

  const ideaUrl = useIdeaUrl(idea.id);
  const shareIdea = useShareIdea(idea);

  const [shareMenuOpen, setShareMenuOpen] = useBoolean();

  const shareCountHelperText = getShareCountHelperText(shareCount);

  const ratingTooltip = getRatingTooltip(idea.ratingCount, idea.ratingCount);
  const roundedAverage = roundAverage(idea.averageRating);

  const shareTabRef = React.useRef<HTMLDivElement | null>(null);

  const [reviewsOpen, setReviewsOpen] = useBoolean();

  const isAuthor = user.uid === idea.author;

  const publish = React.useCallback(() => {
    const withStatus = { status: 'sprout' } as const;
    update(withStatus).then(() => {
      addIdea({ ...idea, ...withStatus });
    });
  }, [update, addIdea, idea]);

  const unpublish = React.useCallback(() => {
    update({ status: 'seed' }).then(() => {
      deleteIdea({ id: idea.id });
    });
  }, [update, deleteIdea, idea.id]);

  const [reviewOpen, setReviewOpen] = useBoolean();

  const titleSectionStyle: React.CSSProperties = React.useMemo(
    () => ({
      opacity: showName ? 1 : 0,
      transition: 'height 300ms ease-in-out, opacity 300ms ease-in-out',
    }),
    [showName],
  );

  return (
    <Box boxShadow={showName ? boxShadow : 'none'}>
      <Tabs value={false} variant={'fullWidth'}>
        <BackToIdeas style={ideaTabStyle} />
        <Tab
          ref={shareTabRef}
          style={ideaTabStyle}
          onClick={setShareMenuOpen.setTrue}
          label={
            <Tooltip title={shareCountHelperText}>
              <Box style={tabChildStyle}>
                {shareCount}
                &nbsp;
                <Share fontSize={'small'} color={'primary'} />
              </Box>
            </Tooltip>
          }
          aria-label={'Share'}
        />
        <Tab
          style={ideaTabStyle}
          onClick={setReviewsOpen.setTrue}
          label={
            <Tooltip title={ratingTooltip}>
              <Box style={tabChildStyle}>
                {roundedAverage}
                &nbsp;
                <StarRate style={withStarColor} />
              </Box>
            </Tooltip>
          }
          aria-label={'Rate'}
        />
        {isAuthor ? (
          <Tab
            style={ideaTabStyle}
            label={
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
            }
            aria-label={'Publish or unpublish'}
          />
        ) : (
          <ReviewButtonSuspender
            reviewOpen={reviewOpen}
            ideaId={idea.id}
            uid={user.uid}
            reviewCount={idea.ratingCount}
            style={ideaTabStyle}
            onClick={setReviewOpen.setTrue}
          />
        )}
        <ExportReviewSuspender idea={idea} user={user} style={ideaTabStyle} />
      </Tabs>
      <Box height={tabsTitleSectionHeight}>
        <Box
          mx={3}
          mb={`${tabsTitleSectionPaddingBottom}px`}
          display={'flex'}
          alignItems={'center'}
          height={showName ? tabsLogoHeight : 0}
          overflow={'hidden'}
          style={titleSectionStyle}
        >
          <Typography variant={'h4'}>{idea.name}</Typography>
          <Box ml={2}>
            <React.Suspense
              fallback={
                <Skeleton
                  variant={'circle'}
                  width={tabsLogoHeight}
                  height={tabsLogoHeight}
                />
              }
            >
              <StorageImage
                style={imageStyle}
                storagePath={idea.logo.path}
                width={tabsLogoHeight}
                height={tabsLogoHeight}
              />
            </React.Suspense>
          </Box>
        </Box>
      </Box>
      <ShareMenu
        anchorEl={shareTabRef.current}
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
