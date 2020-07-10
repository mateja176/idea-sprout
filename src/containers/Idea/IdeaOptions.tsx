import { Button, Tooltip, useTheme } from '@material-ui/core';
import {
  CheckBoxOutlineBlank,
  CloudOff,
  CloudUpload,
  RateReview,
  StarRate,
} from '@material-ui/icons';
import { useBoolean } from 'ahooks';
import { IdeaOptionsWrapper, IdeaPreviewWrapper } from 'components';
import { IdeaImagePreview, ShareMenu } from 'containers';
import { IdeaModel, SetCheck, User } from 'models';
import { equals } from 'ramda';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  createAddIdea,
  createDeleteIdea,
  createQueueSnackbar,
  useActions,
  useIdeaOptionButtonStyle,
  useIdeasRef,
  useUpdateWithCount,
} from 'services';
import { ideaNameStyle, withStarColor } from 'styles';
import urljoin from 'url-join';
import { absolutePrivateRoute, getRatingHelperText } from 'utils';
import { CheckMenu } from './Check';
import { ReviewDialog, ReviewsDialog } from './Review';

export interface IdeaOptionsProps extends Pick<User, 'email' | 'uid'> {
  idea: IdeaModel;
  ideaUrl: string;
  NavigationButton: (props: {
    style: React.CSSProperties;
  }) => React.ReactElement;
}

export const IdeaOptions = React.memo<IdeaOptionsProps>(
  ({ email, uid, idea, ideaUrl, NavigationButton }) => {
    const { addIdea, deleteIdea, queueSnackbar } = useActions({
      addIdea: createAddIdea,
      deleteIdea: createDeleteIdea,
      queueSnackbar: createQueueSnackbar,
    });

    const theme = useTheme();

    const history = useHistory();

    const checkRef = React.useRef<HTMLButtonElement | null>(null);

    const ideaRef = useIdeasRef().doc(idea.id);

    const buttonStyle = useIdeaOptionButtonStyle();

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

    const isAuthor = email === idea.author;

    const problemSolutionStyle: React.CSSProperties = {
      color: theme.palette.text.secondary,
    };

    const ratingTooltip = React.useMemo(
      () => getRatingHelperText(idea.rating),
      [idea.rating],
    );

    const openInFull = React.useCallback(() => {
      history.push(urljoin(absolutePrivateRoute.ideas.path, idea.id));
    }, [history, idea.id]);

    return (
      <>
        <IdeaOptionsWrapper
          key={idea.id}
          onClick={openInFull}
          imagePreview={
            <React.Suspense fallback={<IdeaPreviewWrapper />}>
              <IdeaImagePreview path={idea.images[0].path} />
            </React.Suspense>
          }
          textSection={
            <>
              <Tooltip placement="top" title={idea.name}>
                <span style={ideaNameStyle}>{idea.name}</span>
              </Tooltip>
              <br />
              <Tooltip placement="top" title={idea.problemSolution}>
                <span style={problemSolutionStyle}>{idea.problemSolution}</span>
              </Tooltip>
            </>
          }
          shareOption={<ShareMenu
            style={buttonStyle}
            shareCount={idea.sharedBy.length}
            url={ideaUrl}
          />}
          rateOption={<Tooltip placement="top" title={ratingTooltip}>
          <Button
            style={buttonStyle}
            endIcon={<StarRate style={withStarColor} />}
            onClick={toggleReviewsOpen}
          >
            {idea.rating.average}
          </Button>
        </Tooltip>}
          reviewOption={isAuthor ? (
            idea.status === 'sprout' ? (
              <Tooltip
                placement={'top'}
                title={statusPending ? 'Update Pending' : 'Unpublish'}
              >
                <span>
                  <Button
                    disabled={statusPending}
                    style={buttonStyle}
                    onClick={unpublish}
                  >
                    <CloudOff />
                  </Button>
                </span>
              </Tooltip>
            ) : passedPreflightChecks ? (
              <Tooltip
                placement={'top'}
                title={statusPending ? 'Update Pending' : 'Publish'}
              >
                <span>
                  <Button
                    disabled={statusPending}
                    style={buttonStyle}
                    onClick={publish}
                  >
                    <CloudUpload />
                  </Button>
                </span>
              </Tooltip>
            ) : (
              <Tooltip placement={'top'} title={'Preflight check'}>
                <Button
                  ref={checkRef}
                  style={buttonStyle}
                  onClick={() => {
                    setCheckMenuOpen.toggle();
                  }}
                >
                  <CheckBoxOutlineBlank />
                </Button>
              </Tooltip>
            )
          ) : (
            <Tooltip title="Review" placement="top">
              <Button style={buttonStyle} onClick={toggleReviewOpen}>
                <RateReview color="primary" />
              </Button>
            </Tooltip>
          )}
          navigateOption={<NavigationButton style={buttonStyle} />}
        />
        <ReviewsDialog
          id={idea.id}
          name={idea.name}
          count={idea.rating.count}
          open={reviewsOpen}
          onClose={toggleReviewsOpen}
        />
        <ReviewDialog
          email={email}
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
  equals,
);
