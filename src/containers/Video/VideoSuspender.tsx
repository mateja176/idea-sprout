import { makeStyles, useTheme } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { StorageFile } from 'models';
import React from 'react';
import { useComputedHeight } from 'services';
import { Video } from './Video';

export interface VideoSuspenderProps extends StorageFile {}

const useStyles = makeStyles(() => ({
  text: {
    transform: 'none',
  },
}));

export const VideoSuspender: React.FC<VideoSuspenderProps> = ({
  path,
  width,
  height,
}) => {
  const theme = useTheme();

  const classes = useStyles();

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
            width={'100%'}
            style={{ maxWidth: width }}
            classes={{ text: classes.text }}
          />
        }
      >
        <Video path={path} />
      </React.Suspense>
    </div>
  );
};
