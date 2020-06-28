import {
  Box,
  Button,
  Collapse,
  ListItem,
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
import { Link, ReviewButton } from 'components';
import { IdeaOptions, ReviewDialog, ReviewsDialog } from 'containers';
import { IdeaModel, Review } from 'models';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  useFirestoreCollection,
  useIdeasRef,
  useIdeaUrl,
  useReviewDialogs,
  useReviewsRef,
  useSignedInUser,
} from 'services';
import { ideaMarginBottom } from 'styles';
import urljoin from 'url-join';
import { absolutePrivateRoute } from 'utils';
import { Idea } from './Idea';

export interface IdeaRowProps {
  idea: IdeaModel;
  isAuthor: boolean;
}

export const IdeaRow: React.FC<IdeaRowProps> = ({ idea, isAuthor }) => {
  const theme = useTheme();

  const history = useHistory();

  const user = useSignedInUser();

  const ideasRef = useIdeasRef();
  const ideaRef = React.useMemo(() => ideasRef.doc(idea.id), [
    ideasRef,
    idea.id,
  ]);

  const [expanded, setExpanded] = useBoolean();
  const toggleExpanded = () => {
    setExpanded.toggle();
  };

  const ideaUrl = useIdeaUrl(idea.id);

  const reviews = useFirestoreCollection<Review>(useReviewsRef(idea.id));

  const {
    reviewOpen,
    reviewsOpen,
    toggleReviewOpen,
    toggleReviewsOpen,
  } = useReviewDialogs();

  const toggleReviewAndExpanded = () => {
    setExpanded.setTrue();

    toggleReviewOpen();
  };

  const [checkMenu, setCheckMenu] = useBoolean();

  const checkRef = React.useRef<HTMLButtonElement | null>(null);

  const NavigationButton = React.useCallback(
    ({ style }) => {
      const buttonStyle = {
        ...style,
        color: theme.palette.action.active,
      };

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

      return isAuthor ? (
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
          <Box>
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
          </Box>
        )
      ) : (
        <Tooltip placement={'top'} title={'Open in full'}>
          <Button
            style={buttonStyle}
            onClick={() => {
              history.push(
                urljoin(absolutePrivateRoute.ideas.path, idea.id),
                idea,
              );
            }}
          >
            <OpenInBrowser />
          </Button>
        </Tooltip>
      );
    },
    [theme, history, idea, ideaRef, setCheckMenu, isAuthor],
  );

  return (
    <Box key={idea.id}>
      <ListItem key={idea.id} style={{ paddingTop: 0, paddingBottom: 0 }}>
        <IdeaOptions
          idea={idea}
          ideaUrl={ideaUrl}
          reviews={reviews}
          toggleReviewsOpen={toggleReviewsOpen}
          ConfigButton={({ style }) =>
            isAuthor ? (
              <Tooltip placement="top" title="Edit Idea">
                <Link
                  to={urljoin(
                    absolutePrivateRoute.ideas.children.edit.path,
                    idea.id,
                  )}
                >
                  <Button style={style} color="primary">
                    <Edit />
                  </Button>
                </Link>
              </Tooltip>
            ) : (
              <ReviewButton style={style} onClick={toggleReviewAndExpanded} />
            )
          }
          NavigationButton={NavigationButton}
          expanded={expanded}
          toggleExpanded={toggleExpanded}
        />
      </ListItem>
      <Collapse in={expanded} timeout="auto" mountOnEnter>
        <Box mb={ideaMarginBottom}>
          <Idea {...idea} />
        </Box>
      </Collapse>
      <ReviewsDialog
        name={idea.name}
        open={reviewsOpen}
        onClose={toggleReviewsOpen}
        reviews={reviews}
      />
      <ReviewDialog
        idea={idea}
        ideaUrl={ideaUrl}
        review={reviews.find(({ id }) => id === user.uid)}
        open={reviewOpen}
        onClose={toggleReviewAndExpanded}
      />
      <Menu
        anchorEl={checkRef.current}
        open={checkMenu}
        onClose={setCheckMenu.setFalse}
      >
        <MenuItem>Niche</MenuItem>
        <MenuItem>Expectations</MenuItem>
      </Menu>
    </Box>
  );
};
