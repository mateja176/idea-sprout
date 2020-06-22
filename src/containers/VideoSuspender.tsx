import { Box, makeStyles, useTheme } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React from 'react';
import { useFileDimensions } from 'services';
import { Video, VideoProps } from './Video';

export interface VideoSuspenderProps extends VideoProps {}

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

  // * since a new reference is created on each render, the object cannot be used as a hook dependency
  // * given the fact that it fails the shallow comparison
  const dimensions = useFileDimensions({ width, height });

  return (
    <Box
      bgcolor={theme.palette.grey[900]}
      display="flex"
      justifyContent="center"
      height={dimensions.height}
    >
      <React.Suspense
        fallback={<Skeleton {...dimensions} classes={{ text: classes.text }} />}
      >
        <Video path={path} {...dimensions} />
      </React.Suspense>
    </Box>
  );
};
