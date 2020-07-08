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
import { breakWordStyle, starColor } from 'styles';
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

  const passedPreflightChecks = React.useMemo(() => Object.values(idea.checks).every(Boolean), [idea.checks]);

  const isAuthor = user.email === idea.author;

  const borderColor = theme.palette.grey[600];

  const ratingTooltip = React.useMemo(() => getRatingHelperText(idea.rating), [
    idea.rating,
  ]);

  return (
    <>
      <Box
        display="flex"
        width="100%"
        style={{
          cursor: 'pointer',
        }}
        onClick={() => {
          history.push(urljoin(absolutePrivateRoute.ideas.path, idea.id));
        }}
      >
        <Box mr={1}>
          <React.Suspense fallback={<IdeaPreviewWrapper />}>
            <IdeaImagePreview path={idea.images[0].path} />
          </React.Suspense>
        </Box>
        <Box
          mr={1}
          style={{
            ...breakWordStyle,
            flexGrow: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 5,
            WebkitBoxOrient: 'vertical',
          }}
        >
          <Tooltip placement="top" title={idea.name}>
            <span style={{ fontSize: '1.2em' }}>{idea.name}</span>
          </Tooltip>
          <br />
          <Tooltip placement="top" title={idea.problemSolution}>
            <span style={{ color: theme.palette.text.secondary }}>
              {idea.problemSolution}
            </span>
          </Tooltip>
        </Box>
        <IdeaPreviewWrapper>
          <Box
            width={'100%'}
            height={'100%'}
            border={`1px solid ${borderColor}`}
            borderRadius={5}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Box
              display="flex"
              width={'100%'}
              height={'50%'}
              borderBottom={`1px solid ${borderColor}`}
            >
              <Box
                width={'50%'}
                height={'100%'}
                borderRight={`1px solid ${borderColor}`}
              >
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
                    endIcon={<StarRate style={{ color: starColor }} />}
                    onClick={toggleReviewsOpen}
                  >
                    {idea.rating.average}
                  </Button>
                </Tooltip>
              </Box>
            </Box>
            <Box display="flex" width={'100%'} height={'50%'}>
              <Box
                width={'50%'}
                height={'100%'}
                borderRight={`1px solid ${borderColor}`}
              >
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
