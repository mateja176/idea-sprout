import {
  Box,
  Button,
  ButtonGroup,
  ButtonProps,
  CircularProgress,
} from '@material-ui/core';
import { CloudUpload, Remove } from '@material-ui/icons';
import { StorageFile, StoragePath } from 'models';
import React from 'react';
import { createQueueSnackbar, useActions, useUpload } from 'services';

export const bottomButtonStyle: React.CSSProperties = {
  borderTop: 'none',
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
};

export const rightButtonStyle: React.CSSProperties = {
  borderLeft: 'none',
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
};

const actionCreators = { queueSnackbar: createQueueSnackbar };

export const FileOptions: React.FC<{
  update: (file: StorageFile) => Promise<void>;
  storagePath: StoragePath;
  label?: string;
  Embed?: React.FC<Pick<ButtonProps, 'style'>>;
  remove?: () => void;
  variant?: 'bottom' | 'right';
  justify?: React.CSSProperties['justifyContent'];
}> = ({
  update,
  storagePath,
  label,
  Embed,
  remove,
  variant = 'bottom',
  justify = 'flex-end',
}) => {
  const { queueSnackbar } = useActions(actionCreators);

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const { upload, loading } = useUpload(storagePath);

  const handleClick: React.MouseEventHandler = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  const type = storagePath.slice(0, -1);

  const buttonStyle =
    variant === 'bottom' ? bottomButtonStyle : rightButtonStyle;

  const uploadButtonStyle: React.CSSProperties = React.useMemo(
    () => ({
      ...buttonStyle,
      minWidth: 135,
    }),
    [buttonStyle],
  );

  return (
    <Box
      mx={variant === 'bottom' ? 2 : 0}
      my={variant === 'bottom' ? 0 : 2}
      display={'flex'}
      justifyContent={justify}
      flexDirection={variant === 'bottom' ? 'row' : 'column'}
      height={variant === 'bottom' ? 'auto' : '100%'}
    >
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
      <ButtonGroup
        color={'primary'}
        disabled={loading}
        orientation={variant === 'bottom' ? 'horizontal' : 'vertical'}
      >
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
        {Embed && <Embed style={buttonStyle} />}
        {remove ? (
          <Button style={buttonStyle} onClick={remove} startIcon={<Remove />}>
            Remove
          </Button>
        ) : null}
      </ButtonGroup>
    </Box>
  );
};
