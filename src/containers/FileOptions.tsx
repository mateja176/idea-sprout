import { Box, Button, ButtonGroup } from '@material-ui/core';
import { CloudUpload, Remove } from '@material-ui/icons';
import { StorageFile, StoragePath } from 'models';
import React from 'react';
import { useUpload } from 'services';

export const FileOptions: React.FC<{
  update: (file: StorageFile) => void;
  storagePath: StoragePath;
  remove?: () => void;
  label?: string;
  justify?: React.CSSProperties['justifyContent'];
}> = ({ label, update, storagePath, remove, justify = 'flex-end' }) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const { upload, loading } = useUpload(storagePath);

  const buttonStyle: React.CSSProperties = React.useMemo(
    () => ({
      borderTop: 'none',
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    }),
    [],
  );

  const handleClick: React.MouseEventHandler = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <Box px={2} display={'flex'} justifyContent={justify}>
      <input
        ref={inputRef}
        type={'file'}
        accept={`${storagePath.slice(0, -1)}/*`}
        style={{ display: 'none' }}
        onChange={(e) => {
          const newFile = e.target.files?.[0];
          if (newFile) {
            upload([newFile]).then(([{ path, width, height }]) => {
              const newStorageFile: StorageFile = { path, width, height };

              update(newStorageFile);
            });
          }
        }}
      />
      <ButtonGroup color={'primary'} disabled={loading}>
        {label ? (
          <Button
            style={buttonStyle}
            onClick={handleClick}
            startIcon={<CloudUpload />}
          >
            {label}
          </Button>
        ) : (
          <Button style={buttonStyle} onClick={handleClick}>
            <CloudUpload fontSize={'small'} />
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
