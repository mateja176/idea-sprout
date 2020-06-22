import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@material-ui/core';
import { IdeaModel } from 'models';
import React from 'react';
import { StorageImage } from 'reactfire';
import { Image } from './Image';

export interface ImagesProps extends Pick<IdeaModel, 'images'> {}

const initialFocusedImagePath = '';

export const Images: React.FC<ImagesProps> = ({ images }) => {
  const [focusedImagePath, setFocusedImagePath] = React.useState(
    initialFocusedImagePath,
  );

  const [dialogOpen, setDialogOpen] = React.useState(!!initialFocusedImagePath);

  const toggleDialogOpen = () => {
    setDialogOpen(!dialogOpen);
  };

  return (
    <Box>
      {images.map((image, i) => (
        <Image
          isLast={i === images.length - 1 && images.length > 1}
          {...image}
          onClick={() => {
            setFocusedImagePath(image.path);

            toggleDialogOpen();
          }}
        />
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
  );
};
