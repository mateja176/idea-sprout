import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { IdeaModel } from 'models';
import React from 'react';
import { StorageImage } from 'reactfire';
export interface IdeaProps extends IdeaModel {}

const breakWordStyle: React.CSSProperties = {
  wordBreak: 'break-word',
};

const height = 300;

const initialFocusedImagePath = '';

export const Idea: React.FC<IdeaProps> = (idea) => {
  const [focusedImagePath, setFocusedImagePath] = React.useState(
    initialFocusedImagePath,
  );

  const [dialogOpen, setDialogOpen] = React.useState(!!initialFocusedImagePath);

  const toggleDialogOpen = () => {
    setDialogOpen(!dialogOpen);
  };

  return (
    <Box p={3}>
      <Box>
        <Typography variant="h5">Story</Typography>
        {idea.storyPath}
      </Box>
      <Box>
        <Typography variant="h5">Problem-Solution</Typography>
        <Typography style={breakWordStyle}>{idea.problemSolution}</Typography>
      </Box>
      <Box>
        <Typography variant="h5">Images</Typography>
        <React.Suspense fallback={<Skeleton variant="rect" height={height} />}>
          {idea.imagePaths.map((path) => (
            <StorageImage
              key={path}
              storagePath={path}
              height={height}
              onClick={(e) => {
                setFocusedImagePath(path);

                toggleDialogOpen();
              }}
            />
          ))}
        </React.Suspense>
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
      <Box>
        <Typography variant="h5">Rationale</Typography>
        <Typography style={breakWordStyle}>{idea.rationale}</Typography>
      </Box>
      {/* TODO add call to action for reviewers */}
    </Box>
  );
};
