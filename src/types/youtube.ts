import { CSSProperties } from '@material-ui/core/styles/withStyles';

interface Options extends Pick<CSSProperties, 'width' | 'height'> {
  videoId: string;
  events: { onReady: () => void };
}

export interface Player {
  new (playerId: string, options: Options): Player;
  playerId: string;
  options: Options;
}

export type ready = (onReady: () => void) => void;

export interface YT {
  Player: Player;
  ready: ready;
}
