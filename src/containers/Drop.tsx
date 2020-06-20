import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { ArrowDownward, Info } from '@material-ui/icons';
import React from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { useUpload } from 'services';

export interface DropProps extends DropzoneOptions {
  heading: string;
  description: React.ReactNode;
  path: string;
  onUploadSuccess: (url: string[]) => void;
  fileLimit?: number;
}

export const Drop: React.FC<DropProps> = ({
  heading,
  description,
  path,
  onUploadSuccess,
  fileLimit,
  ...props
}) => {
  const { upload, status } = useUpload(path);

  const isLoading = status === 'loading';

  const [files, setFiles] = React.useState<File[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);

      upload(acceptedFiles.slice(0, fileLimit)).then((url) => {
        onUploadSuccess(url);
      });
    },
    disabled: isLoading,
    ...props,
  });

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const toggleIsDialogOpen: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    setIsDialogOpen(!isDialogOpen);
  };

  return (
    <Box my={3}>
      <Box {...getRootProps()}>
        <Box mb={2}>
          <Box display="flex" alignItems="center">
            <Typography
              variant="h5"
              color={isDragActive ? 'primary' : 'textPrimary'}
            >
              {heading}
            </Typography>
            <Tooltip title="Open dialog with more info" placement="top">
              <IconButton onClick={toggleIsDialogOpen}>
                <Info color="primary" />
              </IconButton>
            </Tooltip>
            <Dialog open={isDialogOpen} onClose={toggleIsDialogOpen}>
              <DialogTitle>
                <DialogContent>
                  <DialogContentText>{description}</DialogContentText>
                </DialogContent>
              </DialogTitle>
              <DialogActions>
                <Button onClick={toggleIsDialogOpen}>Clear</Button>
              </DialogActions>
            </Dialog>
            {fileLimit && (
              <Typography color="textSecondary">( 1 - {fileLimit} )</Typography>
            )}
          </Box>
        </Box>
        <input {...getInputProps()} />
        <Box
          display="grid"
          gridAutoFlow="column"
          justifyContent="flex-start"
          gridGap={10}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowDownward />}
            disabled={isLoading}
          >
            {isDragActive
              ? 'Drop your files here'
              : files.length
              ? 'Choose new file'
              : 'Choose file'}
          </Button>
        </Box>
      </Box>
      <Box mt={2}>
        {files.length ? (
          files.map((file) => (
            <TextField
              key={file.name}
              label="File"
              value={file.name}
              InputProps={{
                readOnly: true,
              }}
            />
          ))
        ) : (
          <Box visibility="hidden">
            <TextField label="File" value="Placeholder" />
          </Box>
        )}
      </Box>
    </Box>
  );
};
