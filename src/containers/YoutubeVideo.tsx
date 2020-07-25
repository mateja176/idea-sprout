import React from 'react';
import { useLoadYoutubeScript, useRenderPlayer } from 'services';

export const YoutubeVideo: React.FC<{ path: string }> = ({
  path,
  children,
}) => {
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
    <>
      <div id={playerId}>{children}</div>
    </>
  );
};
