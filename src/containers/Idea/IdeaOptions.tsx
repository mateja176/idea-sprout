import { Button, makeStyles, useTheme } from '@material-ui/core';
import {
  CheckBoxOutlineBlank,
  CloudOff,
  CloudUpload,
  RateReview,
  StarRate,
} from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { useBoolean } from 'ahooks';
import { IdeaOptionsWrapper, IdeaPreviewWrapper } from 'components';
import { IdeaImagePreview, ShareMenuButton } from 'containers';
import { IdeaModel, SetCheck, User } from 'models';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  createAddIdea,
  createDeleteIdea,
  createQueueSnackbar,
  useActions,
  useIdeaOptionButtonStyle,
  useIdeasRef,
  useShareIdea,
  useUpdateWithCount,
} from 'services';
import { ideaNameStyle, withStarColor } from 'styles';
import urljoin from 'url-join';
import { absolutePrivateRoute } from 'utils';
import { CheckMenu } from './Check';
import { ReviewDialog, ReviewsDialog } from './Review';

export interface IdeaOptionsProps extends Pick<User, 'uid'> {
  idea: IdeaModel;
  ideaUrl: string;
  NavigationButton: (props: {
    style: React.CSSProperties;
  }) => React.ReactElement;
}

const useStyles = makeStyles(() => ({ withoutMargin: { marginLeft: 0 } }));

export const IdeaOptions = React.memo<IdeaOptionsProps>(
  ({ uid, idea, ideaUrl, NavigationButton }) => {
    const { addIdea, deleteIdea, queueSnackbar } = useActions({
      addIdea: createAddIdea,
      deleteIdea: createDeleteIdea,
      queueSnackbar: createQueueSnackbar,
    });

    const classes = useStyles();

    const theme = useTheme();

    const history = useHistory();

    const checkRef = React.useRef<HTMLButtonElement | null>(null);

    const ideaRef = useIdeasRef().doc(idea.id);

    const buttonStyle = useIdeaOptionButtonStyle();

    const shareIdea = useShareIdea(idea);

    const updateWithCount = useUpdateWithCount(idea.id);

    const [reviewOpen, setReviewOpen] = useBoolean();
    const toggleReviewOpen = React.useCallback(() => {
      setReviewOpen.toggle();
    }, [setReviewOpen]);

    const [reviewsOpen, setReviewsOpen] = useBoolean();
    const toggleReviewsOpen = React.useCallback(() => {
      setReviewsOpen.toggle();
    }, [setReviewsOpen]);

    const [checkMenuOpen, setCheckMenuOpen] = useBoolean(false);

    const [statusPending, setStatusPending] = useBoolean(false);

    const publish = React.useCallback(() => {
      setStatusPending.setTrue();
      const withStatus = { status: 'sprout' } as const;
      updateWithCount({ count: 1, ...withStatus })
        .then(() => {
          addIdea({ ...idea, ...withStatus });
        })
        .then(() => {
          queueSnackbar({
            severity: 'success',
            message: 'Idea published!',
          });
        });
    }, [updateWithCount, addIdea, idea, setStatusPending, queueSnackbar]);

    const unpublish = React.useCallback(() => {
      setStatusPending.setTrue();
      updateWithCount({ count: -1, status: 'seed' })
        .then(() => {
          deleteIdea({ id: idea.id });
        })
        .then(() => {
          queueSnackbar({
            severity: 'success',
            message: 'Idea unpublished',
          });
        });
    }, [updateWithCount, deleteIdea, idea.id, setStatusPending, queueSnackbar]);

    const setCheck: SetCheck = React.useCallback(
      (name) => (_, value) => {
        const withChecks: Pick<IdeaModel, 'checks'> = {
          checks: {
            ...idea.checks,
            [name]: value,
          },
        };
        ideaRef.update(withChecks);
      },
      [idea.checks, ideaRef],
    );

    const passedPreflightChecks = React.useMemo(
      () => Object.values(idea.checks).every(Boolean),
      [idea.checks],
    );

    const isAuthor = uid === idea.author;

    const taglineStyle: React.CSSProperties = React.useMemo(
      () => ({
        color: theme.palette.text.secondary,
      }),
      [theme],
    );

    const roundedAverage = idea.averageRating.toFixed(1);

    const ratingTooltip = `Average rating ${roundedAverage} out of total ${idea.ratingCount}`;

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

    return (
      <>
        <IdeaOptionsWrapper
          key={idea.id}
          onClick={openInFull}
          imagePreview={
            <React.Suspense
              fallback={
                <IdeaPreviewWrapper>
                  <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
                </IdeaPreviewWrapper>
              }
            >
              <IdeaImagePreview path={idea.logo.path} />
            </React.Suspense>
          }
          textSection={
            <>
              <span ref={nameRef} title={idea.name} style={ideaNameStyle}>
                {idea.name}
              </span>
              <br />
              <span title={idea.problemSolution} style={taglineStyle}>
                {idea.tagline}
              </span>
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
            <Button
              title={ratingTooltip}
              style={buttonStyle}
              endIcon={<StarRate style={withStarColor} />}
              onClick={toggleReviewsOpen}
              classes={{
                endIcon: classes.withoutMargin,
              }}
            >
              {roundedAverage}
            </Button>
          }
          reviewOption={
            isAuthor ? (
              idea.status === 'sprout' ? (
                <span title={statusPending ? 'Update Pending' : 'Unpublish'}>
                  <Button
                    disabled={statusPending}
                    style={buttonStyle}
                    onClick={unpublish}
                  >
                    <CloudOff />
                  </Button>
                </span>
              ) : passedPreflightChecks ? (
                <span title={statusPending ? 'Update Pending' : 'Publish'}>
                  <Button
                    disabled={statusPending}
                    style={buttonStyle}
                    onClick={publish}
                  >
                    <CloudUpload />
                  </Button>
                </span>
              ) : (
                <Button
                  title={'Preflight check'}
                  ref={checkRef}
                  style={buttonStyle}
                  onClick={() => {
                    setCheckMenuOpen.toggle();
                  }}
                >
                  <CheckBoxOutlineBlank />
                </Button>
              )
            ) : (
              <Button
                title={'Review'}
                style={buttonStyle}
                onClick={toggleReviewOpen}
              >
                <RateReview color="primary" />
              </Button>
            )
          }
          navigateOption={<NavigationButton style={buttonStyle} />}
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
        {!passedPreflightChecks && (
          <CheckMenu
            ref={checkRef}
            open={checkMenuOpen}
            onClose={setCheckMenuOpen.setFalse}
            checks={idea.checks}
            setCheck={setCheck}
          />
        )}
      </>
    );
  },
);
