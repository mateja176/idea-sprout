import { GlobalWithMaybeYT, GlobalWithYT, Player } from 'types/youtube';

const API = 'https://www.youtube.com/iframe_api';

const scriptId = 'youtube-iframe-script';

export type RenderPlayerParams = Pick<Player, 'playerId'> &
  Partial<Omit<Player['options'], 'videoId'>> &
  Pick<Player['options'], 'videoId'>;

export const renderPlayerService = ({
  playerId,
  ...options
}: RenderPlayerParams) => {
  return new Promise((resolve) => {
    if ((globalThis as GlobalWithMaybeYT).YT) {
      new (globalThis as GlobalWithYT).YT.Player(playerId, {
        ...options,
        events: {
          onReady: resolve,
        },
      });
    }
  });
};

export const loadScriptService = () => {
  if (globalThis.document.getElementById(scriptId)) {
    return Promise.resolve();
  } else {
    return new Promise((resolve) => {
      const script = globalThis.document.createElement('script');

      script.id = scriptId;

      script.src = API;

      script.addEventListener('load', () => {
        if ((globalThis as GlobalWithMaybeYT).YT) {
          (globalThis as GlobalWithYT).YT.ready(resolve);
        } else {
          console.error('"globalThis.YT.ready" is not a function');
        }
      });

      globalThis.document.body.appendChild(script);
    });
  }
};

export const createPlayerDiv = (id: string) => {
  const player = globalThis.document.createElement('div');
  player.id = id;
  player.style.width = '100%';

  return player;
};
