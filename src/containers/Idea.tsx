import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
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

const breakWordStyle: React.CSSProperties = {
  wordBreak: 'break-word',
};

const imageHeight = 300;

const initialFocusedImagePath = '';

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
  const [focusedImagePath, setFocusedImagePath] = React.useState(
    initialFocusedImagePath,
  );

  const [dialogOpen, setDialogOpen] = React.useState(!!initialFocusedImagePath);

  const toggleDialogOpen = () => {
    setDialogOpen(!dialogOpen);
  };

  const theme = useTheme();

  return (
    <Box>
      <Box
        bgcolor={theme.palette.grey[900]}
        display="flex"
        justifyContent="center"
      >
        <React.Suspense fallback={<Skeleton height={videoMaxHeight} />}>
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
            <React.Suspense fallback={<Skeleton height={imageHeight} />}>
              <StorageImage
                key={path}
                storagePath={path}
                height={imageHeight}
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
