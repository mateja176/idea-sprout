export const storagePaths = ['videos', 'images'] as const;
export type StoragePaths = typeof storagePaths;
export type StoragePath = StoragePaths[number];
