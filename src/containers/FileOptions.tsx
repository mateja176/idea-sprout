import Box from '@material-ui/core/Box';
import Button, { ButtonProps } from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CloudUpload from '@material-ui/icons/CloudUpload';
import Remove from '@material-ui/icons/Remove';
import React from 'react';
import { PreloadContext } from '../context/preload';
import { StoragePath } from '../models/firebase';
import { UpdateStorageFile } from '../models/idea';
import { UploadButtonSuspender } from './UploadButtonSuspender';

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

export const FileOptions: React.FC<{
  update: UpdateStorageFile;
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
  const preloaded = React.useContext(PreloadContext);

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
      <ButtonGroup
        color={'primary'}
        orientation={variant === 'bottom' ? 'horizontal' : 'vertical'}
      >
        {preloaded.hasWindow ? (
          <UploadButtonSuspender
            storagePath={storagePath}
            update={update}
            style={uploadButtonStyle}
            label={label}
          />
        ) : (
          <Button style={uploadButtonStyle} startIcon={<CloudUpload />}>
            New logo
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
