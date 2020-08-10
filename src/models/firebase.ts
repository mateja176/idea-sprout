export const storagePaths = ['videos', 'images'] as const;
export type StoragePaths = typeof storagePaths;
export type StoragePath = StoragePaths[number];
export const storagePath = storagePaths.reduce(
  (storagePath, path) => ({ ...storagePath, [path]: path }),
  {} as { [key in StoragePath]: key },
);

export const claims = {
  pro: {
    isPro: true,
  },
} as const;

export type Claims = Partial<typeof claims[keyof typeof claims]>;
