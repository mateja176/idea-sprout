import { IdeaModel } from './idea';

export const storagePaths = ['videos', 'images'] as const;
export type StoragePaths = typeof storagePaths;
export type StoragePath = StoragePaths[number];
export const storagePath = storagePaths.reduce(
  (storagePath, path) => ({ ...storagePath, [path]: path }),
  {} as { [key in StoragePath]: key },
);

export interface IdeaFilter<Key extends keyof IdeaModel> {
  fieldPath: Key;
  opStr: firebase.firestore.WhereFilterOp;
  value: IdeaModel[Key];
}

export const claims = {
  pro: {
    isPro: true,
  },
};
