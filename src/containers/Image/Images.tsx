import Box from '@material-ui/core/Box';
import { useTheme } from '@material-ui/core/styles';
import React from 'react';
import { FileOptions } from '../../containers/FileOptions';
import { PreloadContext } from '../../context/preload';
import { IdeaModel, UpdateIdea } from '../../models/idea';
import { mediaBgGreyVariant } from '../../utils/styles/styles';
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
  const theme = useTheme();

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
          height={'100%'}
          key={`${path}${i}`}
          display="flex"
          justifyContent={'center'}
          borderBottom={
            i === images.length - 1
              ? 'none'
              : `1px solid ${theme.palette.grey[900]}`
          }
          bgcolor={theme.palette.grey[mediaBgGreyVariant]}
        >
          <Image
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
