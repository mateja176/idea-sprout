export interface Player {
  new (
    playerId: string,
    options: { videoId: string; events: { onReady: () => void } },
  ): Player;
  playerId: string;
  options: { videoId: string; events: { onReady: () => void } };
}

export type ready = (onReady: () => void) => void;

export interface YT {
  Player: Player;
  ready: ready;
}
