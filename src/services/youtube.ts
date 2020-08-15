import { Player } from 'types/youtube';

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
    if (window.YT) {
      new window.YT.Player(playerId, {
        ...options,
        events: {
          onReady: resolve,
        },
      });
    }
  });
};

export const loadScriptService = () => {
  if (window.document.getElementById(scriptId)) {
    return Promise.resolve();
  } else {
    return new Promise((resolve) => {
      const script = window.document.createElement('script');

      script.id = scriptId;

      script.src = API;

      script.addEventListener('load', () => {
        if (window.YT) {
          window.YT.ready(resolve);
        } else {
          console.error('"window.YT.ready" is not a function');
        }
      });

      window.document.body.appendChild(script);
    });
  }
};

export const createPlayerDiv = (id: string) => {
  const player = window.document.createElement('div');
  player.id = id;
  player.style.width = '100%';

  return player;
};
