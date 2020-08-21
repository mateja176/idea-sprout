export type _reactFirePreloadedObservables = Map<string[], string>;

export interface WithReactfire {
  _reactFirePreloadedObservables?: _reactFirePreloadedObservables;
}

export type GlobalWithReactfire = typeof globalThis & WithReactfire;
