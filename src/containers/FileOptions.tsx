import Box from '@material-ui/core/Box';
import Button, { ButtonProps } from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import CloudUpload from '@material-ui/icons/CloudUpload';
import Remove from '@material-ui/icons/Remove';
import React from 'react';
import { PreloadContext } from '../context/preload';
import { StoragePath } from '../models/firebase';
import { UpdateStorageFile } from '../models/idea';
import { UploadButtonSuspender } from './UploadButtonSuspender';

const uploadStyle: React.CSSProperties = { minWidth: 135 };

const useStyles = makeStyles(() => ({
  groupedVertical: {
    borderLeft: 'none !important',
  },
  groupedHorizontal: {
    borderTop: 'none !important',
  },
}));

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

  const classes = useStyles(variant);

  const firstButtonStyle: React.CSSProperties = React.useMemo(
    () => ({
      borderTopRightRadius: variant === 'bottom' ? 0 : 4,
      borderBottomLeftRadius: variant === 'bottom' ? 4 : 0,
    }),
    [variant],
  );

  const theme = useTheme();

  const buttonStyle: React.CSSProperties = React.useMemo(
    () => ({
      color: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
      boxSizing: 'border-box',
    }),
    [theme],
  );

  const uploadButtonStyle: React.CSSProperties = React.useMemo(
    () => ({
      ...uploadStyle,
      ...buttonStyle,
      ...firstButtonStyle,
    }),
    [firstButtonStyle, buttonStyle],
  );

  const lastButtonStyle: React.CSSProperties = React.useMemo(
    () => ({
      borderTopRightRadius: variant === 'bottom' ? 0 : 4,
      borderBottomLeftRadius: 0,
    }),
    [variant],
  );

  const embedStyle: React.CSSProperties = React.useMemo(
    () => (remove ? buttonStyle : { ...buttonStyle, ...lastButtonStyle }),
    [buttonStyle, remove, lastButtonStyle],
  );

  const removeStyle: React.CSSProperties = React.useMemo(
    () => ({ ...buttonStyle, ...lastButtonStyle }),
    [buttonStyle, lastButtonStyle],
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
        orientation={variant === 'bottom' ? 'horizontal' : 'vertical'}
        classes={classes}
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
        {Embed && <Embed style={embedStyle} />}
        {!!remove && (
          <Button onClick={remove} startIcon={<Remove />} style={removeStyle}>
            Remove
          </Button>
        )}
      </ButtonGroup>
    </Box>
  );
};
