import { Player } from 'types/youtube';

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
