import { useTheme } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { StorageFile } from 'models';
import React from 'react';
import { useComputedHeight } from 'services';
import { Video } from './Video';

export interface VideoSuspenderProps extends StorageFile {}

export const VideoSuspender: React.FC<VideoSuspenderProps> = ({
  path,
  width,
  height,
}) => {
  const theme = useTheme();

  const { computedHeight, ref } = useComputedHeight({ width, height });

  return (
    <div
      ref={ref}
      style={{
        backgroundColor: theme.palette.grey[900],
        display: 'flex',
        justifyContent: 'center',
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
        <Video path={path} />
      </React.Suspense>
    </div>
  );
};
