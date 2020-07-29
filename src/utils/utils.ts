export const arrayToMap = <V extends string | number>(a: ReadonlyArray<V>) =>
  Object.fromEntries(a.map((v) => [v, v])) as Record<V, V>;
