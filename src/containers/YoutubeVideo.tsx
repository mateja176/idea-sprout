import React from 'react';
import { useLoadYoutubeScript, useRenderPlayer } from '../hooks/youtube';
import { StorageFile } from '../models/idea';
import { createPlayerDiv } from '../services/youtube';

const options = { height: '100%' };

export const YoutubeVideo: React.FC<
  { path: string } & Pick<StorageFile, 'width'>
> = ({ path, width }) => {
  const { renderPlayer, playerId } = useRenderPlayer(options);

  const { loadScript } = useLoadYoutubeScript();

  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.firstChild?.remove();
      // * this avoids a conflict of interests between the YT script and React
      // * since YT removes the div replacing it with an iframe
      // * and when React attempts to remove the div an error is thrown
      // * hence a div is used which is not managed by React
      const player = createPlayerDiv(playerId);
      ref.current.appendChild(player);

      loadScript(() => {
        renderPlayer({ videoId: path });
      });
    }
  }, [path, loadScript, playerId, renderPlayer]);

  const style = React.useMemo(() => ({ width: '100%', maxWidth: width }), [
    width,
  ]);

  return <div ref={ref} style={style} />;
};
