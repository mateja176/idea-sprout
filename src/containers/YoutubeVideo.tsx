import React from 'react';
import { useRenderPlayer, useLoadYoutubeScript } from 'services';

export const YoutubeVideo: React.FC<{ path: string }> = ({
  path,
  children,
}) => {
  const { renderPlayer, videoLoading, playerId } = useRenderPlayer();

  const { loadScript, scriptLoading } = useLoadYoutubeScript();

  const renderVideo = React.useCallback(() => renderPlayer({ videoId: path }), [
    path,
    renderPlayer,
  ]);

  React.useEffect(() => {
    loadScript(renderVideo);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {(videoLoading || scriptLoading) && children}
      <div id={playerId} />
    </>
  );
};
