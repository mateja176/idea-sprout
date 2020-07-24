import { Box, Button, ButtonGroup, CircularProgress } from '@material-ui/core';
import { CloudUpload, Remove } from '@material-ui/icons';
import { StorageFile, StoragePath } from 'models';
import React from 'react';
import { createQueueSnackbar, useActions, useUpload } from 'services';

export const buttonStyle: React.CSSProperties = {
  borderTop: 'none',
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
};

export const uploadButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  minWidth: 200,
};

export const FileOptions: React.FC<{
  update: (file: StorageFile) => void;
  storagePath: StoragePath;
  remove?: () => void;
  label?: string;
  justify?: React.CSSProperties['justifyContent'];
}> = ({ label, update, storagePath, remove, justify = 'flex-end' }) => {
  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const { upload, loading } = useUpload(storagePath);

  const handleClick: React.MouseEventHandler = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  const type = storagePath.slice(0, -1);

  return (
    <Box px={2} display={'flex'} justifyContent={justify}>
      <input
        ref={inputRef}
        type={'file'}
        accept={`${type}/*`}
        style={{ display: 'none' }}
        onChange={(e) => {
          const newFile = e.target.files?.[0];
          if (newFile) {
            upload([newFile])
              .then(([{ path, width, height }]) => {
                const newStorageFile: StorageFile = { path, width, height };

                update(newStorageFile);
              })
              .catch((error: Error) => {
                queueSnackbar({
                  severity: 'error',
                  message: error.message,
                });
              });
          }
        }}
      />
      <ButtonGroup color={'primary'} disabled={loading}>
        {label ? (
          <Button
            style={uploadButtonStyle}
            onClick={handleClick}
            startIcon={
              loading ? <CircularProgress size={'1em'} /> : <CloudUpload />
            }
          >
            {loading ? `Uploading ${type}` : label}
          </Button>
        ) : (
          <Button style={buttonStyle} onClick={handleClick}>
            {loading ? (
              <CircularProgress size={'1em'} />
            ) : (
              <CloudUpload fontSize={'small'} />
            )}
          </Button>
        )}
        {remove ? (
          <Button style={buttonStyle} onClick={remove} startIcon={<Remove />}>
            Remove
          </Button>
        ) : null}
      </ButtonGroup>
    </Box>
  );
};
