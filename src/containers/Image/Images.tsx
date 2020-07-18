import { Box } from '@material-ui/core';
import { FileOptions } from 'containers';
import { IdeaModel, UpdateIdea } from 'models';
import React from 'react';
import { Image } from './Image';

export interface ImagesProps extends Pick<IdeaModel, 'images'> {
  isAuthor: boolean;
  update: UpdateIdea;
}

export const Images: React.FC<ImagesProps> = ({ images, isAuthor, update }) => {
  return (
    <Box>
      {images.map((image, i) => (
        <Box key={`${image.path}${i}`} display="flex" flexDirection="column">
          <Image
            isLast={i === images.length - 1 && images.length > 1}
            {...image}
          />
          {isAuthor && (
            <FileOptions
              label={'Choose new image'}
              storagePath={'images'}
              update={(newImage) => {
                update({
                  images: images.map((_, j) => (j === i ? newImage : _)),
                });
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
};
