import { Button, makeStyles, Tooltip, useTheme } from '@material-ui/core';
import { CloudOff, Publish, RateReview, StarRate } from '@material-ui/icons';
import { useBoolean } from 'ahooks';
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
  useShareIdea,
  useUpdateWithCount,
} from 'services';
import { ideaNameStyle, withStarColor } from 'styles';
import urljoin from 'url-join';
import { absolutePrivateRoute, getRatingTooltip, roundAverage } from 'utils';
import { IdeaImagePreviewSuspender } from './IdeaImagePreviewSuspender';
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
    const { addIdea, deleteIdea } = useActions({
      addIdea: createAddIdea,
      deleteIdea: createDeleteIdea,
    });

    const classes = useStyles();

    const theme = useTheme();

    const history = useHistory();

    // const checkRef = React.useRef<HTMLButtonElement | null>(null);

    // const ideaRef = useIdeasRef().doc(idea.id);

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
              >
                {roundedAverage}
              </Button>
            </Tooltip>
          }
          reviewOption={
            isAuthor ? (
              idea.status === 'sprout' ? (
                <Tooltip title={'Unpublish'}>
                  <Button style={buttonStyle} onClick={unpublish}>
                    <CloudOff />
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip title={'Publish'}>
                  <Button style={buttonStyle} onClick={publish}>
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
                //   >
                //     <CheckBoxOutlineBlank />
                //   </Button>
                // </Tooltip>
              )
            ) : (
              <Tooltip title={'Review'}>
                <Button style={buttonStyle} onClick={toggleReviewOpen}>
                  <RateReview color="primary" />
                </Button>
              </Tooltip>
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
