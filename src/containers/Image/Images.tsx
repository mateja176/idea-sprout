import { Box } from '@material-ui/core';
import { IdeaModel } from 'models';
import React from 'react';
import { Image } from './Image';

export interface ImagesProps extends Pick<IdeaModel, 'images'> {}

export const Images: React.FC<ImagesProps> = ({ images }) => {
  return (
    <Box>
      {images.map((image, i) => (
        <Image
          key={`${image.path}${i}`}
          isLast={i === images.length - 1 && images.length > 1}
          {...image}
        />
      ))}
    </Box>
  );
};
