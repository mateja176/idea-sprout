import { CSSProperties } from 'react';

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

export interface WithYT {
  YT: YT;
}

export type GlobalWithMaybeYT = typeof globalThis & Partial<WithYT>;

export type GlobalWithYT = typeof globalThis & WithYT;
