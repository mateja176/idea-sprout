import { StorageFile } from 'models';
import React from 'react';
import { useLoadYoutubeScript, useRenderPlayer } from 'services';

export const YoutubeVideo: React.FC<
  { path: string } & Pick<StorageFile, 'width'>
> = ({ path, width }) => {
  const { renderPlayer, playerId } = useRenderPlayer({ height: '100%' });

  const { loadScript } = useLoadYoutubeScript();

  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    // * this avoids a conflict of interests between the YT script and React
    // * since YT removes the div replacing it with an iframe
    // * and when React attempts to remove the div an error is thrown
    // * hence a div is used which is not managed by React
    const player = document.createElement('div');
    player.id = playerId;
    player.style.width = '100%';
    ref.current?.appendChild(player);

    loadScript(() => renderPlayer({ videoId: path }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={ref} style={{ width: '100%', maxWidth: width }} />;
};
