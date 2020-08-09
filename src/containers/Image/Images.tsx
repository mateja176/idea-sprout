import Box from '@material-ui/core/Box';
import { FileOptions } from 'containers/FileOptions';
import { ideaSelector } from 'elements/idea/tour';
import { IdeaModel, UpdateIdea } from 'models/idea';
import React from 'react';
import { Image } from './Image';

export interface ImagesProps extends Pick<IdeaModel, 'images'> {
  isAuthor: boolean;
  update: UpdateIdea;
}

export const Images: React.FC<ImagesProps> = ({ images, isAuthor, update }) => {
  const handleUpdate: React.ComponentProps<
    typeof FileOptions
  >['update'] = React.useCallback(
    (newImage) =>
      update({
        images: [newImage],
      }),
    [update],
  );
  return (
    <>
      {images.map((image, i) => (
        <Box
          id={ideaSelector.image}
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
          // * FileOptions is outside because of the '100%' height constraint
          // * images restricted to 1 for the time being
          update={handleUpdate}
        />
      )}
    </>
  );
};
