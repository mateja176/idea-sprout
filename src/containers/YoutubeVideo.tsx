import { Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { StorageFile } from 'models';
import React from 'react';
import { useLoadYoutubeScript, useRenderPlayer } from 'services';

export const YoutubeVideo: React.FC<
  { path: string } & Pick<StorageFile, 'width'>
> = ({ path, width }) => {
  const { renderPlayer, playerId } = useRenderPlayer();

  const { loadScript } = useLoadYoutubeScript();

  const renderVideo = React.useCallback(() => renderPlayer({ videoId: path }), [
    path,
    renderPlayer,
  ]);

  React.useEffect(() => {
    loadScript(renderVideo);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box id={playerId} width={'100%'} maxWidth={width}>
      <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
    </Box>
  );
};
