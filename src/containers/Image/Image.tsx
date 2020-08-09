import Box from '@material-ui/core/Box';
import useTheme from '@material-ui/core/styles/useTheme';
import Skeleton from '@material-ui/lab/Skeleton';
import { StorageFile } from 'models';
import React from 'react';
import { StorageImage } from 'reactfire';
import { mediaBgGreyVariant } from 'styles/styles';

export interface ImageProps
  extends StorageFile,
    Pick<React.ComponentProps<typeof StorageImage>, 'onClick'> {
  isLast?: boolean;
}

const imageStyle: React.CSSProperties = { maxWidth: '100%' };

export const Image: React.FC<ImageProps> = ({
  onClick,
  path,
  width,
  height,
  isLast = false,
}) => {
  const theme = useTheme();

  const skeletonStyle: React.CSSProperties = React.useMemo(
    () => ({ maxWidth: width }),
    [width],
  );

  return (
    <Box
      key={path}
      display={'flex'}
      justifyContent={'center'}
      bgcolor={theme.palette.grey[mediaBgGreyVariant]}
      borderBottom={isLast ? 'none' : `1px solid ${theme.palette.grey[900]}`}
      height={`calc(100vw * ${height / width})`}
      maxHeight={'100%'}
    >
      <React.Suspense
        fallback={
          <Skeleton
            variant={'rect'}
            height={'100%'}
            width={'100%'}
            style={skeletonStyle}
          />
        }
      >
        <StorageImage
          storagePath={path}
          height={'100%'}
          style={imageStyle}
          onClick={onClick}
        />
      </React.Suspense>
    </Box>
  );
};
