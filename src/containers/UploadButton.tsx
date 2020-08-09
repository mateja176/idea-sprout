import Button, { ButtonProps } from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloudUpload from '@material-ui/icons/CloudUpload';
import { SnackbarContext } from 'context/snackbar';
import { StoragePath } from 'models/firebase';
import { StorageFile, UpdateStorageFile } from 'models/idea';
import React from 'react';
import { useUpload } from 'services/hooks/upload';

const inputStyle: React.CSSProperties = { display: 'none' };

export const UploadButton: React.FC<
  {
    update: UpdateStorageFile;
    storagePath: StoragePath;
    label?: string;
  } & ButtonProps
> = ({ storagePath, update, label, ...props }) => {
  const { queueSnackbar } = React.useContext(SnackbarContext);

  const { upload, loading } = useUpload(storagePath);

  const type = storagePath.slice(0, -1);

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleClick: React.MouseEventHandler = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    (e) => {
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
    },
    [queueSnackbar, update, upload],
  );

  return (
    <>
      <input
        ref={inputRef}
        type={'file'}
        accept={`${type}/*`}
        style={inputStyle}
        onChange={handleChange}
      />
      {label ? (
        <Button
          {...props}
          onClick={handleClick}
          startIcon={
            loading ? <CircularProgress size={'1em'} /> : <CloudUpload />
          }
        >
          {loading ? `Uploading ${type}` : label}
        </Button>
      ) : (
        <Button {...props} onClick={handleClick}>
          {loading ? (
            <CircularProgress size={'1em'} />
          ) : (
            <CloudUpload fontSize={'small'} />
          )}
        </Button>
      )}
    </>
  );
};
