export const checkNames = ['niche', 'expectations'] as const;
export type CheckNames = typeof checkNames;
export type CheckName = CheckNames[number];

export const ideaStatuses = ['seed', 'sprout', 'bloom', 'shrivel'] as const;
export type IdeaStatuses = typeof ideaStatuses;
export type IdeaStatus = IdeaStatuses[number];

export interface StorageFile {
  path: string;
  width: number;
  height: number;
}

export interface IdeaModel {
  id: string;
  /**
   * author email
   */
  author: string;
  rating: {
    average: number;
    total: number;
  };
  /**
   * the checks are a way of guiding creators towards publishing high quality ideas
   */
  checks: { [key in CheckName]: boolean };
  status: IdeaStatus;
  name: string;
  story: StorageFile;
  problemSolution: string;
  images: StorageFile[];
  rationale: string;
  /**
   * number of times an idea has been shared
   * the count is incremented only when an user shares the idea for the first time
   * used to pass the "mom test"
   */
  shareCount: number;
}

export type RawIdea = Omit<IdeaModel, 'id'>;

export type CreationIdea = Omit<
  IdeaModel,
  'id' | 'author' | 'rating' | 'status' | 'checks' | 'shareCount'
> &
  IdeaModel['checks'];
