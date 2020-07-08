import {
  Box,
  Button,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from '@material-ui/core';
import {
  CheckBoxOutlineBlank,
  CloudOff,
  CloudUpload,
  StarRate,
} from '@material-ui/icons';
import { useBoolean } from 'ahooks';
import { IdeaPreviewWrapper, ReviewButton } from 'components';
import { CheckProps, IdeaImagePreview, ShareMenu } from 'containers';
import { IdeaModel, User } from 'models';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  useIdeaOptionButtonStyle,
  useIdeasRef,
  useUpdateWithCount,
} from 'services';
import { breakWordStyle, withStarColor, withPointer } from 'styles';
import urljoin from 'url-join';
import { absolutePrivateRoute, getRatingHelperText } from 'utils';
import { ExpectationsCheck } from './ExpectationsCheck';
import { NicheCheck } from './NicheCheck';
import { ReviewDialog, ReviewsDialog } from './Review';

export interface IdeaOptionsProps {
  user: User;
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

export const IdeaOptions: React.FC<IdeaOptionsProps> = ({
  user,
  idea,
  ideaUrl,
  NavigationButton,
}) => {
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

  const [checkMenu, setCheckMenu] = useBoolean(false);

  const publish = React.useCallback(() => {
    updateWithCount({ count: 1, status: 'sprout' });
  }, [updateWithCount]);

  const unpublish = React.useCallback(() => {
    updateWithCount({ count: -1, status: 'seed' });
  }, [updateWithCount]);

  const setCheck = React.useCallback(
    (name: keyof IdeaModel['checks']): CheckProps['onChange'] => (_, value) => {
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

  const isAuthor = user.email === idea.author;

  const buttonBorder = `1px solid ${theme.palette.grey[600]}`;

  const problemSolutionStyle: React.CSSProperties = {
    color: theme.palette.text.secondary,
  };

  const ratingTooltip = React.useMemo(() => getRatingHelperText(idea.rating), [
    idea.rating,
  ]);

  const stopPropagation: React.MouseEventHandler = (e) => {
    e.stopPropagation();
  };

  const openInFull = React.useCallback(() => {
    history.push(urljoin(absolutePrivateRoute.ideas.path, idea.id));
  }, [history, idea.id]);

  return (
    <>
      <Box display="flex" width="100%" style={withPointer} onClick={openInFull}>
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
                    <Tooltip placement={'top'} title={'Unpublish'}>
                      <Button style={buttonStyle} onClick={unpublish}>
                        <CloudOff />
                      </Button>
                    </Tooltip>
                  ) : passedPreflightChecks ? (
                    <Tooltip placement={'top'} title={'Publish'}>
                      <Button style={buttonStyle} onClick={publish}>
                        <CloudUpload />
                      </Button>
                    </Tooltip>
                  ) : (
                    <Tooltip placement={'top'} title={'Preflight check'}>
                      <Button
                        ref={checkRef}
                        style={buttonStyle}
                        onClick={() => {
                          setCheckMenu.toggle();
                        }}
                      >
                        <CheckBoxOutlineBlank />
                      </Button>
                    </Tooltip>
                  )
                ) : (
                  <ReviewButton
                    style={buttonStyle}
                    onClick={toggleReviewOpen}
                  />
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
        user={user}
        idea={idea}
        ideaUrl={ideaUrl}
        open={reviewOpen}
        onClose={toggleReviewOpen}
      />
      <Menu
        anchorEl={checkRef.current}
        open={checkMenu && !passedPreflightChecks}
        onClose={setCheckMenu.setFalse}
      >
        <MenuItem>
          <NicheCheck
            checked={idea.checks.niche}
            onChange={setCheck('niche')}
          />
        </MenuItem>
        <MenuItem>
          <ExpectationsCheck
            checked={idea.checks.expectations}
            onChange={setCheck('expectations')}
          />
        </MenuItem>
      </Menu>
    </>
  );
};
