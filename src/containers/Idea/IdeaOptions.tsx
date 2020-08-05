import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import Tooltip from '@material-ui/core/Tooltip';
import CloudOff from '@material-ui/icons/CloudOff';
import Publish from '@material-ui/icons/Publish';
import RateReview from '@material-ui/icons/RateReview';
import StarRate from '@material-ui/icons/StarRate';
import useBoolean from 'ahooks/es/useBoolean';
import { IdeaOptionsWrapper } from 'components';
import { ShareMenuButton } from 'containers';
import { IdeaModel, User } from 'models';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  createAddIdea,
  createDeleteIdea,
  useActions,
  useIdeaOptionButtonStyle,
  useIdeaRef,
  useShareIdea,
} from 'services';
import { ideaNameStyle, withStarColor } from 'styles';
import urljoin from 'url-join';
import { absolutePrivateRoute, getRatingTooltip, roundAverage } from 'utils';
import { IdeaImagePreviewSuspender } from './ImagePreview';
import { ReviewDialog, ReviewsDialog } from './Review';

export interface IdeaOptionsProps extends Pick<User, 'uid'> {
  idea: IdeaModel;
  ideaUrl: string;
  navigationButton: React.ReactNode;
}

const useStyles = makeStyles(() => ({ withoutMargin: { marginLeft: 0 } }));

const actionCreators = {
  addIdea: createAddIdea,
  deleteIdea: createDeleteIdea,
};

export const IdeaOptions = React.memo<IdeaOptionsProps>(
  ({ uid, idea, ideaUrl, navigationButton }) => {
    const { addIdea, deleteIdea } = useActions(actionCreators);

    const classes = useStyles();

    const theme = useTheme();

    const history = useHistory();

    // const checkRef = React.useRef<HTMLButtonElement | null>(null);

    const ideaRef = useIdeaRef(idea.id);

    const buttonStyle = useIdeaOptionButtonStyle();

    const shareIdea = useShareIdea(idea);

    const [reviewOpen, setReviewOpen] = useBoolean();
    const toggleReviewOpen = React.useCallback(() => {
      setReviewOpen.toggle();
    }, [setReviewOpen]);

    const [reviewsOpen, setReviewsOpen] = useBoolean();
    const toggleReviewsOpen = React.useCallback(() => {
      setReviewsOpen.toggle();
    }, [setReviewsOpen]);

    const publish = React.useCallback(() => {
      const withStatus = { status: 'sprout' } as const;
      ideaRef.update(withStatus).then(() => {
        addIdea({ ...idea, ...withStatus });
      });
    }, [ideaRef, addIdea, idea]);

    const unpublish = React.useCallback(() => {
      ideaRef.update({ status: 'seed' }).then(() => {
        deleteIdea({ id: idea.id });
      });
    }, [ideaRef, deleteIdea, idea.id]);

    // const setCheck: SetCheck = React.useCallback(
    //   (name) => (_, value) => {
    //     const withChecks: Pick<IdeaModel, 'checks'> = {
    //       checks: {
    //         ...idea.checks,
    //         [name]: value,
    //       },
    //     };
    //     ideaRef.update(withChecks);
    //   },
    //   [idea.checks, ideaRef],
    // );

    // const passedPreflightChecks = React.useMemo(
    //   () => Object.values(idea.checks).every(Boolean),
    //   [idea.checks],
    // );

    const isAuthor = uid === idea.author;

    const taglineStyle: React.CSSProperties = React.useMemo(
      () => ({
        color: theme.palette.text.secondary,
      }),
      [theme],
    );

    const roundedAverage = roundAverage(idea.averageRating);

    const ratingTooltip = getRatingTooltip(
      idea.ratingCount,
      idea.averageRating,
    );

    const openInFull = React.useCallback(() => {
      history.push(urljoin(absolutePrivateRoute.ideas.path, idea.id));
    }, [history, idea.id]);

    const shareCount = React.useMemo(() => Object.keys(idea.sharedBy).length, [
      idea.sharedBy,
    ]);

    const nameRef = React.useRef<HTMLSpanElement | null>(null);
    React.useEffect(() => {
      if (nameRef.current) {
        const nameWidth = nameRef.current.getBoundingClientRect().width;
        const parentWidth =
          nameRef.current.parentElement?.getBoundingClientRect().width ?? 0;
        if (parentWidth < nameWidth) {
          nameRef.current.animate(
            [
              { transform: 'translateX(0px)' },
              { transform: `translateX(${-(nameWidth - parentWidth + 10)}px)` },
            ],
            {
              duration: 3000,
              iterations: Infinity,
              easing: 'cubic-bezier(.8,0,.3,1)',
              direction: 'alternate',
            },
          );
        }
      }
    }, []);

    const rateOptionsClasses = React.useMemo(
      () => ({
        endIcon: classes.withoutMargin,
      }),
      [classes.withoutMargin],
    );

    return (
      <>
        <IdeaOptionsWrapper
          key={idea.id}
          onClick={openInFull}
          imagePreview={<IdeaImagePreviewSuspender path={idea.logo.path} />}
          textSection={
            <>
              <Tooltip title={idea.name}>
                <span ref={nameRef} style={ideaNameStyle}>
                  {idea.name}
                </span>
              </Tooltip>
              <br />
              <Tooltip title={idea.tagline}>
                <span style={taglineStyle}>{idea.tagline}</span>
              </Tooltip>
            </>
          }
          shareOption={
            <ShareMenuButton
              style={buttonStyle}
              shareCount={shareCount}
              url={ideaUrl}
              shareIdea={shareIdea}
            />
          }
          rateOption={
            <Tooltip placement={'top'} title={ratingTooltip}>
              <Button
                style={buttonStyle}
                endIcon={<StarRate style={withStarColor} />}
                onClick={toggleReviewsOpen}
                classes={rateOptionsClasses}
                aria-label={'Rate'}
              >
                {roundedAverage}
              </Button>
            </Tooltip>
          }
          reviewOption={
            isAuthor ? (
              idea.status === 'sprout' ? (
                <Tooltip title={'Unpublish'}>
                  <Button
                    style={buttonStyle}
                    onClick={unpublish}
                    aria-label={'Unpublish'}
                  >
                    <CloudOff />
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip title={'Publish'}>
                  <Button
                    style={buttonStyle}
                    onClick={publish}
                    aria-label={'Publish'}
                  >
                    <Publish />
                  </Button>
                </Tooltip>
                // <Tooltip title={'Preflight check'}>
                //   <Button
                //     ref={checkRef}
                //     style={buttonStyle}
                //     onClick={() => {
                //       setCheckMenuOpen.toggle();
                //     }}
                //     aria-label={'Preflight check'}
                //   >
                //     <CheckBoxOutlineBlank />
                //   </Button>
                // </Tooltip>
              )
            ) : (
              <Tooltip title={'Review'}>
                <Button
                  style={buttonStyle}
                  onClick={toggleReviewOpen}
                  aria-label={'Review'}
                >
                  <RateReview color="primary" />
                </Button>
              </Tooltip>
            )
          }
          navigateOption={navigationButton}
        />
        <ReviewsDialog
          id={idea.id}
          name={idea.name}
          count={idea.ratingCount}
          open={reviewsOpen}
          onClose={toggleReviewsOpen}
        />
        <ReviewDialog
          uid={uid}
          idea={idea}
          ideaUrl={ideaUrl}
          open={reviewOpen}
          onClose={toggleReviewOpen}
        />
        {/* {!passedPreflightChecks && (
          <CheckMenu
            ref={checkRef}
            open={checkMenuOpen}
            onClose={setCheckMenuOpen.setFalse}
            checks={idea.checks}
            setCheck={setCheck}
          />
        )} */}
      </>
    );
  },
);
