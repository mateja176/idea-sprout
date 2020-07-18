import { useTheme } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { StorageFile } from 'models';
import React from 'react';
import { StorageImage } from 'reactfire';
import { useComputedHeight } from 'services';

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

  const computedHeight = useComputedHeight({ width, height });

  return (
    <div
      key={path}
      style={{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: theme.palette.grey[900],
        borderBottom: isLast ? 'none' : `1px solid ${theme.palette.grey[900]}`,
        height: computedHeight,
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
          height={computedHeight}
          onClick={onClick}
        />
      </React.Suspense>
    </div>
  );
};
