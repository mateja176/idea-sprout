import Box from '@material-ui/core/Box';
import React from 'react';
import { FileOptions } from '../../containers/FileOptions';
import { PreloadContext } from '../../context/preload';
import { ideaSelector } from '../../elements/idea/tour';
import { IdeaModel, UpdateIdea } from '../../models/idea';
import { Image } from './Image';

export interface ImagesProps extends Pick<IdeaModel, 'images'> {
  ideaName: IdeaModel['name'];
  isAuthor: boolean;
  update: UpdateIdea;
}

export const Images: React.FC<ImagesProps> = ({
  ideaName,
  images,
  isAuthor,
  update,
}) => {
  const preloaded = React.useContext(PreloadContext);

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
      {images.map(({ path, ...image }, i) => (
        <Box
          id={ideaSelector.image}
          height={'100%'}
          key={`${path}${i}`}
          display="flex"
          flexDirection="column"
        >
          <Image
            isLast={i === images.length - 1}
            {...image}
            path={path}
            src={preloaded.imageUrls[i]}
            i={i}
            ideaName={ideaName}
          />
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
