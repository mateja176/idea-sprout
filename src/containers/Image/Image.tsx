import { useTheme } from '@material-ui/core';
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
    <div
      key={path}
      style={{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: theme.palette.grey[900],
        borderBottom: isLast ? 'none' : `1px solid ${theme.palette.grey[900]}`,
        height: `calc(${height / width} * 100vw)`,
        maxHeight: height,
      }}
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
          width={'100%'}
          style={{ maxWidth: width }}
          onClick={onClick}
        />
      </React.Suspense>
    </div>
  );
};
