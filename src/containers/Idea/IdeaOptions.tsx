import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from '@material-ui/core';
import {
  CheckBoxOutlineBlank,
  CloudOff,
  CloudUpload,
} from '@material-ui/icons';
import { useBoolean } from 'ahooks';
import { IdeaPreviewWrapper, ReviewButton } from 'components';
import {
  IdeaImagePreview,
  ReviewDialog,
  ReviewsDialog,
  ShareMenu,
} from 'containers';
import { IdeaModel } from 'models';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  useIdeaOptionButtonStyle,
  useIdeasRef,
  useSignedInUser,
} from 'services';
import urljoin from 'url-join';
import { absolutePrivateRoute } from 'utils';
import { IdeaDoubleOptionSkeleton } from './IdeaOptionsSkeleton';
import { IdeaRatingOption } from './IdeaRatingOption';

export interface IdeaOptionsProps {
  idea: IdeaModel;
  ideaUrl: string;
  NavigationButton: (props: {
    style: React.CSSProperties;
  }) => React.ReactElement;
}

export const IdeaOptions: React.FC<IdeaOptionsProps> = ({
  idea,
  ideaUrl,
  NavigationButton,
}) => {
  const user = useSignedInUser();

  const isAuthor = user.email === idea.author;

  const theme = useTheme();

  const history = useHistory();

  const borderColor = theme.palette.grey[600];

  const buttonStyle = useIdeaOptionButtonStyle();

  const [reviewOpen, setReviewOpen] = useBoolean();
  const toggleReviewOpen = () => {
    setReviewOpen.toggle();
  };

  const [reviewsOpen, setReviewsOpen] = useBoolean();
  const toggleReviewsOpen = () => {
    setReviewsOpen.toggle();
  };

  const [checkMenu, setCheckMenu] = useBoolean();

  const checkRef = React.useRef<HTMLButtonElement | null>(null);

  const passedPreflightChecks = Object.values(idea.checks).every(Boolean);

  const ideaRef = useIdeasRef().doc(idea.id);

  const publish = () => {
    const withStatus: Pick<IdeaModel, 'status'> = {
      status: 'sprout',
    };
    ideaRef.update(withStatus);
  };

  const unpublish = () => {
    const withStatus: Pick<IdeaModel, 'status'> = {
      status: 'seed',
    };
    ideaRef.update(withStatus);
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
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
            flexGrow: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'break-word',
            display: '-webkit-box',
            WebkitLineClamp: 4,
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
                <React.Suspense fallback={<IdeaDoubleOptionSkeleton />}>
                  <IdeaRatingOption id={idea.id} onClick={toggleReviewsOpen} />
                </React.Suspense>
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
      <React.Suspense fallback={null}>
        <ReviewsDialog
          id={idea.id}
          name={idea.name}
          open={reviewsOpen}
          onClose={toggleReviewsOpen}
        />
      </React.Suspense>
      <React.Suspense fallback={null}>
        <ReviewDialog
          user={user}
          idea={idea}
          ideaUrl={ideaUrl}
          open={reviewOpen}
          onClose={toggleReviewOpen}
        />
      </React.Suspense>
      <Menu
        anchorEl={checkRef.current}
        open={checkMenu && !passedPreflightChecks}
        onClose={setCheckMenu.setFalse}
      >
        <MenuItem>
          <FormControl>
            <FormControlLabel
              label="Niche"
              control={
                <Checkbox
                  checked={idea.checks.niche}
                  onChange={(_, value) => {
                    const withChecks: Pick<IdeaModel, 'checks'> = {
                      checks: {
                        ...idea.checks,
                        niche: value,
                      },
                    };
                    ideaRef.update(withChecks);
                  }}
                />
              }
            />
          </FormControl>
        </MenuItem>
        <MenuItem>
          <FormControl>
            <FormControlLabel
              label="Expectations"
              control={
                <Checkbox
                  checked={idea.checks.expectations}
                  onChange={(_, value) => {
                    const withChecks: Pick<IdeaModel, 'checks'> = {
                      checks: {
                        ...idea.checks,
                        expectations: value,
                      },
                    };
                    ideaRef.update(withChecks);
                  }}
                />
              }
            />
          </FormControl>
        </MenuItem>
      </Menu>
    </>
  );
};
