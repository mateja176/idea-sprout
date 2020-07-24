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
    <>
      {images.map((image, i) => (
        <Box
          height={'100%'}
          key={`${image.path}${i}`}
          display="flex"
          flexDirection="column"
        >
          <Image isLast={i === images.length - 1} {...image} />
        </Box>
      ))}
      {isAuthor && (
        <FileOptions
          label={'New image'}
          storagePath={'images'}
          update={(newImage) => {
            // * FileOptions is outside because of the '100%' height constraint
            // * images restricted to 1 for the time being
            update({
              images: [newImage],
            });
          }}
        />
      )}
    </>
  );
};
