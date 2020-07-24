import { useTheme, Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { StorageFile } from 'models';
import React from 'react';
import { StorageImage } from 'reactfire';

export interface ImageProps
  extends StorageFile,
    Pick<React.ComponentProps<typeof StorageImage>, 'onClick'> {
  isLast?: boolean;
}

export const Image: React.FC<ImageProps> = ({
  onClick,
  path,
  width,
  height,
  isLast = false,
}) => {
  const theme = useTheme();

  return (
    <Box
      key={path}
      display={'flex'}
      justifyContent={'center'}
      bgcolor={theme.palette.grey[900]}
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
            style={{ maxWidth: width }}
          />
        }
      >
        <StorageImage
          storagePath={path}
          height={'100%'}
          style={{ maxWidth: '100%' }}
          onClick={onClick}
        />
      </React.Suspense>
    </Box>
  );
};
