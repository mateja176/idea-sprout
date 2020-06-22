import { Box, useTheme } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { StorageFile } from 'models';
import React from 'react';
import { StorageImage } from 'reactfire';
import { useFileDimensions } from 'services';

export interface ImageProps
  extends StorageFile,
    Pick<React.ComponentProps<typeof StorageImage>, 'onClick'> {
  isLast: boolean;
}

export const Image: React.FC<ImageProps> = ({
  isLast,
  onClick,
  path,
  width,
  height,
}) => {
  const theme = useTheme();

  const dimensions = useFileDimensions({ width, height });

  return (
    <Box
      key={path}
      display="flex"
      justifyContent="center"
      bgcolor={theme.palette.grey[900]}
      borderBottom={isLast ? 'none' : `1px solid ${theme.palette.grey[900]}`}
    >
      <React.Suspense fallback={<Skeleton {...dimensions} />}>
        <StorageImage
          key={path}
          storagePath={path}
          {...dimensions}
          onClick={onClick}
        />
      </React.Suspense>
    </Box>
  );
};
