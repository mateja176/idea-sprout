import { Box, makeStyles, useTheme } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React from 'react';
import { useFileDimensions } from 'services';
import { Video, VideoProps } from './Video';

export interface FullVideoProps extends VideoProps {}

const useStyles = makeStyles(() => ({
  text: {
    transform: 'none',
  },
}));

export const FullVideo: React.FC<FullVideoProps> = ({
  path,
  width,
  height,
}) => {
  const theme = useTheme();

  const classes = useStyles();

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
