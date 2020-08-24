import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';
import { StorageImage } from 'reactfire';
import { IdeaModel, StorageFile } from '../../models/idea';

export interface ImageProps
  extends StorageFile,
    Pick<React.ComponentProps<typeof StorageImage>, 'onClick'> {
  ideaName: IdeaModel['name'];
  i: number;
  src?: string;
}

const imageStyle: React.CSSProperties = { maxWidth: '100%' };

export const Image: React.FC<ImageProps> = ({
  onClick,
  path,
  width,
  height,
  ideaName,
  i,
  src,
}) => {
  const skeletonStyle: React.CSSProperties = React.useMemo(
    () => ({ maxWidth: width }),
    [width],
  );

  const alt = `${ideaName} ${i}`;

  const preloadedImageStyle: React.CSSProperties = React.useMemo(
    () => ({
      ...imageStyle,
      width,
    }),
    [width],
  );

  return src ? (
    <img src={src} style={preloadedImageStyle} alt={alt} />
  ) : (
    <Box
      key={path}
      display={'flex'}
      justifyContent={'center'}
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
          alt={alt}
        />
      </React.Suspense>
    </Box>
  );
};
