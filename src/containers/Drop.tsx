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
  TextFieldProps,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { ArrowDownward, Info } from '@material-ui/icons';
import { useBoolean } from 'ahooks';
import { SnackbarContext } from 'context';
import { StorageFile, StoragePath } from 'models';
import React from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { useUpload } from 'services';

export interface DropProps extends DropzoneOptions {
  heading: string;
  description: React.ReactNode;
  path: StoragePath;
  onUploadSuccess: (files: StorageFile[]) => void;
  preloadedFileNames: File['name'][];
  fileLimit?: number;
}

const inputProps: TextFieldProps['InputProps'] = {
  readOnly: true,
};

const DisplayFile: React.FC<Pick<File, 'name'>> = ({ name }) => (
  <Box mb={2}>
    <TextField key={name} label="File" value={name} InputProps={inputProps} />
  </Box>
);

export const Drop: React.FC<DropProps> = ({
  heading,
  description,
  path,
  onUploadSuccess,
  fileLimit,
  preloadedFileNames,
  ...props
}) => {
  const { queueSnackbar } = React.useContext(SnackbarContext);

  const { upload, loading } = useUpload(path);

  const [files, setFiles] = React.useState<File[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);

      upload(acceptedFiles.slice(0, fileLimit))
        .then((files) => {
          queueSnackbar({
            severity: 'success',
            message: `Files uploaded`,
          });

          onUploadSuccess(files);
        })
        .catch((error: Error) => {
          queueSnackbar({
            severity: 'error',
            message: error.message,
          });
        });
    },
    disabled: loading,
    ...props,
  });

  const [isDialogOpen, setIsDialogOpen] = useBoolean();
  const toggleIsDialogOpen: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    setIsDialogOpen.toggle();
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
              <IconButton color="primary" onClick={toggleIsDialogOpen}>
                <Info />
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
            <Typography color="textSecondary">
              {fileLimit ? `( 1 - ${fileLimit} )` : `( ${fileLimit ?? 1} )`}
            </Typography>
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
            disabled={loading}
          >
            {isDragActive
              ? 'Drop your files here'
              : files.length
              ? 'Choose new file'
              : 'Choose file'}
          </Button>
        </Box>
      </Box>
      <Box mt={2} mb={4}>
        {files.length ? (
          files.map(({ name }) => <DisplayFile key={name} name={name} />)
        ) : preloadedFileNames.length ? (
          preloadedFileNames.map((name) => (
            <DisplayFile key={name} name={name} />
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
