import { Box, Button, ButtonGroup } from '@material-ui/core';
import { CloudUpload, Remove } from '@material-ui/icons';
import { StorageFile, StoragePath, UpdateIdea } from 'models';
import React from 'react';
import { createQueueSnackbar, useActions, useUpload } from 'services';

export const FileOptions: React.FC<{
  update: UpdateIdea;
  storagePath: StoragePath;
  files?: StorageFile[];
  i?: number;
}> = ({ update, storagePath, files = [], i = -1 }) => {
  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const { upload, loading } = useUpload(storagePath);

  const buttonStyle: React.CSSProperties = {
    borderTop: 'none',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  };

  return (
    <Box px={2} display={'flex'} justifyContent={'flex-end'}>
      <input
        ref={inputRef}
        type={'file'}
        accept={`${storagePath.slice(-1)}/*`}
        style={{ display: 'none' }}
        onChange={(e) => {
          const newFile = e.target.files?.[0];
          if (newFile) {
            upload([newFile]).then(([{ path, width, height }]) => {
              const newStorageFile: StorageFile = { path, width, height };

              update(
                storagePath === 'images'
                  ? {
                      images: files.map((_, j) =>
                        j === i ? newStorageFile : _,
                      ),
                    }
                  : {
                      story: newStorageFile,
                    },
              );
            });
          }
        }}
      />
      <ButtonGroup color={'primary'} disabled={loading}>
        <Button
          style={buttonStyle}
          onClick={() => {
            inputRef.current?.click();
          }}
          startIcon={<CloudUpload />}
        >
          Choose new
        </Button>
        {files.length > 1 ? (
          <Button
            style={buttonStyle}
            onClick={() => {
              update({
                images: files.filter((_, j) => j !== i),
              }).then(() => {
                queueSnackbar({
                  severity: 'success',
                  message: 'File removed',
                  autoHideDuration: 2000,
                });
              });
            }}
            startIcon={<Remove />}
          >
            Remove
          </Button>
        ) : null}
      </ButtonGroup>
    </Box>
  );
};
