import { Box, Button, Tooltip, useTheme } from '@material-ui/core';
import {
  CheckBoxOutlineBlank,
  CloudOff,
  CloudUpload,
  RateReview,
  StarRate,
} from '@material-ui/icons';
import { useBoolean } from 'ahooks';
import { IdeaPreviewWrapper } from 'components';
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
import { breakWordStyle, withPointer, withStarColor } from 'styles';
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

const ideaNameStyle: React.CSSProperties = { fontSize: '1.2em' };

const textSectionStyle: React.CSSProperties = {
  ...breakWordStyle,
  flexGrow: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 5,
  WebkitBoxOrient: 'vertical',
};

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
    const toggleReviewOpen = () => {
      setReviewOpen.toggle();
    };

    const [reviewsOpen, setReviewsOpen] = useBoolean();
    const toggleReviewsOpen = () => {
      setReviewsOpen.toggle();
    };

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

    const buttonBorder = `1px solid ${theme.palette.grey[600]}`;

    const problemSolutionStyle: React.CSSProperties = {
      color: theme.palette.text.secondary,
    };

    const ratingTooltip = React.useMemo(
      () => getRatingHelperText(idea.rating),
      [idea.rating],
    );

    const stopPropagation: React.MouseEventHandler = (e) => {
      e.stopPropagation();
    };

    const openInFull = React.useCallback(() => {
      history.push(urljoin(absolutePrivateRoute.ideas.path, idea.id));
    }, [history, idea.id]);

    return (
      <>
        <Box
          display="flex"
          width="100%"
          onClick={openInFull}
        >
          <Box mr={1}>
            <React.Suspense fallback={<IdeaPreviewWrapper />}>
              <IdeaImagePreview path={idea.images[0].path} />
            </React.Suspense>
          </Box>
          <Box mr={1} style={textSectionStyle}>
            <Tooltip placement="top" title={idea.name}>
              <span style={ideaNameStyle}>{idea.name}</span>
            </Tooltip>
            <br />
            <Tooltip placement="top" title={idea.problemSolution}>
              <span style={problemSolutionStyle}>{idea.problemSolution}</span>
            </Tooltip>
          </Box>
          <IdeaPreviewWrapper>
            <Box
              width={'100%'}
              height={'100%'}
              border={buttonBorder}
              borderRadius={5}
              onClick={stopPropagation}
            >
              <Box
                display="flex"
                width={'100%'}
                height={'50%'}
                borderBottom={buttonBorder}
              >
                <Box width={'50%'} height={'100%'} borderRight={buttonBorder}>
                  <ShareMenu
                    style={buttonStyle}
                    shareCount={idea.sharedBy.length}
                    url={ideaUrl}
                  />
                </Box>
                <Box width={'50%'} height={'100%'}>
                  <Tooltip placement="top" title={ratingTooltip}>
                    <Button
                      style={buttonStyle}
                      endIcon={<StarRate style={withStarColor} />}
                      onClick={toggleReviewsOpen}
                    >
                      {idea.rating.average}
                    </Button>
                  </Tooltip>
                </Box>
              </Box>
              <Box display="flex" width={'100%'} height={'50%'}>
                <Box width={'50%'} height={'100%'} borderRight={buttonBorder}>
                  {isAuthor ? (
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
                </Box>
                <Box width={'50%'} height={'100%'}>
                  <NavigationButton style={buttonStyle} />
                </Box>
              </Box>
            </Box>
          </IdeaPreviewWrapper>
        </Box>
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
