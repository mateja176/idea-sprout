import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  makeStyles,
  Typography,
  useTheme,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { IdeaModel } from 'models';
import React from 'react';
import { StorageImage } from 'reactfire';
import { videoMaxHeight } from 'styles';
import { Video } from './Video';
export interface IdeaProps extends IdeaModel {}

export const maxMediaHeight = 720;
export const maxMediaWidth = 1280;

const videoAspectRatio = maxMediaWidth / maxMediaHeight;

const imageMaxWidth = maxMediaWidth;

const initialFocusedImagePath = '';

const useStyles = makeStyles(() => ({
  text: {
    transform: 'none',
  },
}));

const breakWordStyle: React.CSSProperties = {
  wordBreak: 'break-word',
};

const TitleWrapper: React.FC = ({ children }) => (
  <Box mx={3} my={4}>
    {children}
  </Box>
);

const Section: React.FC = ({ children }) => (
  <TitleWrapper>
    {React.Children.map(children, (child, i) =>
      i === 0 ? <Box mb={2}>{child}</Box> : child,
    )}
  </TitleWrapper>
);

export const Idea: React.FC<IdeaProps> = (idea) => {
  const classes = useStyles();

  const [focusedImagePath, setFocusedImagePath] = React.useState(
    initialFocusedImagePath,
  );

  const [dialogOpen, setDialogOpen] = React.useState(!!initialFocusedImagePath);

  const toggleDialogOpen = () => {
    setDialogOpen(!dialogOpen);
  };

  const theme = useTheme();

  const [screenWidth, setScreenWidth] = React.useState(0);

  React.useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const videoHeight = Math.min(screenWidth / videoAspectRatio, videoMaxHeight);

  return (
    <Box>
      <Box
        bgcolor={theme.palette.grey[900]}
        display="flex"
        justifyContent="center"
        height={videoHeight}
      >
        <React.Suspense
          fallback={<Skeleton width="100%" classes={{ text: classes.text }} />}
        >
          <Video storyPath={idea.storyPath} />
        </React.Suspense>
      </Box>
      <Section>
        <Typography variant="h5">Problem-Solution</Typography>
        <Typography style={breakWordStyle}>{idea.problemSolution}</Typography>
      </Section>
      <Box>
        <TitleWrapper>
          <Typography variant="h5">Images</Typography>
        </TitleWrapper>
        {idea.imagePaths.map((path, i) => (
          <Box
            key={path}
            display="flex"
            justifyContent="center"
            bgcolor={theme.palette.grey[900]}
            borderBottom={
              i !== idea.imagePaths.length - 1
                ? `1px solid ${theme.palette.grey[900]}`
                : 'none'
            }
          >
            <React.Suspense
              fallback={
                <Skeleton style={{ width: '100%', maxWidth: imageMaxWidth }} />
              }
            >
              <StorageImage
                key={path}
                storagePath={path}
                style={{ width: '100%', maxWidth: imageMaxWidth }}
                onClick={() => {
                  setFocusedImagePath(path);

                  toggleDialogOpen();
                }}
              />
            </React.Suspense>
          </Box>
        ))}
        <Dialog
          open={dialogOpen}
          onClose={toggleDialogOpen}
          fullWidth
          maxWidth="xl"
        >
          <DialogContent>
            <Box display="flex" justifyContent="center">
              <StorageImage storagePath={focusedImagePath} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={toggleDialogOpen}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Section>
        <Typography variant="h5">Rationale</Typography>
        <Typography style={breakWordStyle}>{idea.rationale}</Typography>
      </Section>
      {/* TODO add call to action for reviewers */}
    </Box>
  );
};
