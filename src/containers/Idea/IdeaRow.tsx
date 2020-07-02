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
  Edit,
  OpenInBrowser,
} from '@material-ui/icons';
import { useBoolean } from 'ahooks';
import { IdeaOptionsWrapper, ReviewButton } from 'components';
import { IdeaOptions, ReviewDialog, ReviewsDialog } from 'containers';
import 'firebase/firestore';
import { IdeaModel, User } from 'models';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  useIdeaOptionButtonStyle,
  useIdeasRef,
  useIdeaUrl,
  useReviewDialogs,
} from 'services';
import urljoin from 'url-join';
import { absolutePrivateRoute } from 'utils';

export interface IdeaRowProps {
  idea: IdeaModel;
  user: User;
}

export const IdeaRow: React.FC<IdeaRowProps> = ({ idea, user }) => {
  const isAuthor = user.email === idea.author;

  const theme = useTheme();

  const history = useHistory();

  const ideaRef = useIdeasRef().doc(idea.id);

  const ideaUrl = useIdeaUrl(idea.id);

  const {
    reviewOpen,
    reviewsOpen,
    toggleReviewOpen,
    toggleReviewsOpen,
  } = useReviewDialogs();

  const [checkMenu, setCheckMenu] = useBoolean();

  const checkRef = React.useRef<HTMLButtonElement | null>(null);

  const passedPreflightChecks = Object.values(idea.checks).every(Boolean);

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

  const buttonStyle = useIdeaOptionButtonStyle();

  const navigationButtonStyle = {
    ...buttonStyle,
    color: theme.palette.action.active,
  };

  return (
    <Box key={idea.id}>
      <IdeaOptionsWrapper key={idea.id}>
        <IdeaOptions
          idea={idea}
          ideaUrl={ideaUrl}
          toggleReviewsOpen={toggleReviewsOpen}
          configButton={
            isAuthor ? (
              <Tooltip placement="top" title="Edit Idea">
                <Button
                  style={buttonStyle}
                  color="primary"
                  onClick={() => {
                    history.push(
                      urljoin(
                        absolutePrivateRoute.ideas.children.edit.path,
                        idea.id,
                      ),
                      { idea },
                    );
                  }}
                >
                  <Edit />
                </Button>
              </Tooltip>
            ) : (
              <ReviewButton style={buttonStyle} onClick={toggleReviewOpen} />
            )
          }
          navigationButton={
            isAuthor ? (
              idea.status === 'sprout' ? (
                <Tooltip placement={'top'} title={'Unpublish'}>
                  <Button style={navigationButtonStyle} onClick={unpublish}>
                    <CloudOff />
                  </Button>
                </Tooltip>
              ) : passedPreflightChecks ? (
                <Tooltip placement={'top'} title={'Publish'}>
                  <Button style={navigationButtonStyle} onClick={publish}>
                    <CloudUpload />
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip placement={'top'} title={'Preflight check'}>
                  <Button
                    ref={checkRef}
                    style={navigationButtonStyle}
                    onClick={() => {
                      setCheckMenu.toggle();
                    }}
                  >
                    <CheckBoxOutlineBlank />
                  </Button>
                </Tooltip>
              )
            ) : (
              <Tooltip placement={'top'} title={'Open in full'}>
                <Button
                  style={navigationButtonStyle}
                  onClick={() => {
                    history.push(
                      urljoin(absolutePrivateRoute.ideas.path, idea.id),
                      { idea },
                    );
                  }}
                >
                  <OpenInBrowser />
                </Button>
              </Tooltip>
            )
          }
        />
      </IdeaOptionsWrapper>
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
    </Box>
  );
};
