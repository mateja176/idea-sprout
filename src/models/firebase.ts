import { IdeaModel } from './idea';

export const storagePaths = ['videos', 'images'] as const;
export type StoragePaths = typeof storagePaths;
export type StoragePath = StoragePaths[number];

export interface IdeaFilter<Key extends keyof IdeaModel> {
  fieldPath: Key;
  opStr: firebase.firestore.WhereFilterOp;
  value: IdeaModel[Key];
}
