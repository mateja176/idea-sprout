import { Box, Button, TextField, Typography } from '@material-ui/core';
import { ArrowDownward, CloudUpload } from '@material-ui/icons';
import React from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { useUpload } from 'services';

export interface DropProps extends DropzoneOptions {
  heading: string;
  path: string;
  onUploadSuccess: (url: string[]) => void;
  fileLimit?: number;
}

export const Drop: React.FC<DropProps> = ({
  heading,
  path,
  onUploadSuccess,
  fileLimit,
  ...props
}) => {
  const { upload, status } = useUpload(path);

  const [files, setFiles] = React.useState<File[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    },
    ...props,
  });

  const handleUpload: React.MouseEventHandler = (e) => {
    e.stopPropagation();

    upload(files.slice(0, fileLimit))
      .then((url) => {
        onUploadSuccess(url);
      })
      .then(() => {
        setFiles([]);
      });
  };

  return (
    <Box my={3}>
      <Box {...getRootProps()}>
        <Box mb={2} display="flex" alignItems="center">
          <Typography
            variant="h5"
            color={isDragActive ? 'primary' : 'textPrimary'}
          >
            {heading}
          </Typography>
          &nbsp;
          {fileLimit && (
            <Typography color="textSecondary">
              ( 1 - {fileLimit} )
            </Typography>
          )}
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
            startIcon={<CloudUpload />}
            disabled={!files || status === 'loading'}
            onClick={handleUpload}
          >
            Upload
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowDownward />}
          >
            {isDragActive
              ? 'Drop your files here'
              : files
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
              disabled
              label="File"
              value={file.name}
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
