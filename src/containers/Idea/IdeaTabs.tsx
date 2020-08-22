import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CloudOff from '@material-ui/icons/CloudOff';
import EmojiEvents from '@material-ui/icons/EmojiEvents';
import Person from '@material-ui/icons/Person';
import Publish from '@material-ui/icons/Publish';
import RateReview from '@material-ui/icons/RateReview';
import Share from '@material-ui/icons/Share';
import StarRate from '@material-ui/icons/StarRate';
import Skeleton from '@material-ui/lab/Skeleton';
import { useBoolean } from 'ahooks';
import React from 'react';
import { StorageImage } from 'reactfire';
import { ShareMenu } from '../../containers/Share/ShareMenu';
import LazySignin from '../../containers/Signin/LazySignin';
import { useShareIdea } from '../../hooks/firebase';
import { useActions } from '../../hooks/hooks';
import { useIdeaUrl } from '../../hooks/idea';
import { useReviewPromptStyles } from '../../hooks/style';
import { WithMaybeUser } from '../../models/auth';
import { IdeaModel } from '../../models/idea';
import {
  createAddIdea,
  createDeleteIdea,
} from '../../services/store/slices/ideas';
import {
  getRatingTooltip,
  getShareCountHelperText,
  roundAverage,
} from '../../utils/idea/idea';
import { getReviewPrompt } from '../../utils/idea/review';
import {
  ideaTabStyle,
  logoBorderRadius,
  tabChildStyle,
  tabsLogoHeight,
  tabsTitleSectionHeight,
  withEllipsis,
  withStarColor,
} from '../../utils/styles/styles';
import { IdeaProps } from './Idea';
import { IdeasLink } from './IdeasLink';
import { ReviewButtonSuspender } from './Review/Button/ReviewButtonSuspender';
import { ExportReviewSuspender } from './Review/Export/ExportReviewSuspender';
import { ReviewDialog } from './Review/ReviewDialog';
import { ReviewsDialog } from './Review/ReviewsDialog';

const signinDialogContentStyle: React.CSSProperties = { padding: 0 };

const boxShadow = 'rgba(0, 0, 0, 0.2) 0px 5px 8px';

const imageStyle: React.CSSProperties = { borderRadius: logoBorderRadius };

const actionCreators = {
  addIdea: createAddIdea,
  deleteIdea: createDeleteIdea,
};

export const IdeaTabs: React.FC<
  {
    idea: IdeaModel;
    showName: boolean;
  } & WithMaybeUser &
    Pick<IdeaProps, 'update'>
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

  const isAuthor = user?.uid === idea.author;

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

  const [signinDialogOpen, setSigninDialogOpen] = useBoolean();
  React.useEffect(() => {
    if (user && signinDialogOpen) {
      setSigninDialogOpen.setFalse();
    }
  }, [user, signinDialogOpen, setSigninDialogOpen]);

  const reviewPromptClasses = useReviewPromptStyles();

  return (
    <Box boxShadow={showName ? boxShadow : 'none'}>
      <Tabs value={false} variant={'fullWidth'}>
        {user ? (
          <IdeasLink style={ideaTabStyle} />
        ) : (
          <Tab
            aria-label={'Sign in'}
            style={ideaTabStyle}
            onClick={setSigninDialogOpen.setTrue}
            label={
              <Tooltip title={'Sign in to check out more ideas'}>
                <Box style={tabChildStyle}>
                  <Person color={'primary'} />
                </Box>
              </Tooltip>
            }
          />
        )}
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
        ) : user ? (
          <ReviewButtonSuspender
            reviewOpen={reviewOpen}
            ideaId={idea.id}
            uid={user.uid}
            reviewCount={idea.ratingCount}
            style={ideaTabStyle}
            onClick={setReviewOpen.setTrue}
            tooltipClosed={showName}
          />
        ) : (
          <Tab
            aria-label={'Sign in and Review'}
            style={ideaTabStyle}
            label={
              <Tooltip
                open
                title={getReviewPrompt(idea.ratingCount)}
                classes={reviewPromptClasses}
              >
                <Box
                  style={tabChildStyle}
                  onClick={setSigninDialogOpen.setTrue}
                >
                  <RateReview color={'primary'} />
                </Box>
              </Tooltip>
            }
          />
        )}
        {user ? (
          <ExportReviewSuspender idea={idea} user={user} style={ideaTabStyle} />
        ) : (
          <Tab
            aria-label={'Sign in to join the pros'}
            style={ideaTabStyle}
            label={
              <Tooltip title={'Sign in to join the pros'}>
                <Box
                  style={tabChildStyle}
                  onClick={setSigninDialogOpen.setTrue}
                >
                  <EmojiEvents color={'secondary'} />
                </Box>
              </Tooltip>
            }
          />
        )}
      </Tabs>
      <Box height={tabsTitleSectionHeight}>
        <Box
          mx={3}
          display={'flex'}
          alignItems={'center'}
          height={showName ? tabsLogoHeight : 0}
          overflow={'hidden'}
          style={titleSectionStyle}
        >
          <Box mr={2} overflow={'hidden'}>
            <Typography variant={'h4'} style={withEllipsis}>
              {idea.name}
            </Typography>
          </Box>
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
      {user && (
        <ReviewDialog
          uid={user.uid}
          idea={idea}
          ideaUrl={ideaUrl}
          open={reviewOpen}
          onClose={setReviewOpen.setFalse}
        />
      )}
      <Dialog open={signinDialogOpen} fullScreen>
        <DialogContent style={signinDialogContentStyle}>
          <Box display={'flex'} flexDirection={'column'} height={'100%'}>
            <LazySignin user={user} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={setSigninDialogOpen.setFalse}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
