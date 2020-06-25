import * as yup from 'yup';

export const checkNames = ['niche', 'expectations'] as const;
export type CheckNames = typeof checkNames;
export type CheckName = CheckNames[number];

export const checkSchema = yup.bool().required();

export const ideaStatuses = ['seed', 'sprout', 'bloom', 'shrivel'] as const;
export type IdeaStatuses = typeof ideaStatuses;
export type IdeaStatus = IdeaStatuses[number];

export interface FileDimensions {
  width: number;
  height: number;
}

export interface WithPath {
  path: string;
}

export interface StorageFile extends FileDimensions, WithPath {}

export const StorageFileSchema = yup
  .object()
  .required()
  .shape<StorageFile>({
    path: yup.string().min(1).required(),
    width: yup.number().required(),
    height: yup.number().required(),
  });

export interface IdeaModel {
  id: string;
  /**
   * author email
   */
  author: string;
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
  sharedBy: string[];
}

export type RawIdea = Omit<IdeaModel, 'id'>;

export type CreationIdea = Omit<
  IdeaModel,
  'id' | 'author' | 'status' | 'sharedBy'
>;

export enum ProblemSolutionLength {
  min = 80,
  max = 200,
}

export enum RationaleLength {
  min = 80,
  max = 400,
}

export const creationIdeaSchema = yup
  .object()
  .required()
  .shape<CreationIdea>({
    checks: yup
      .object()
      .required()
      .shape({ niche: checkSchema, expectations: checkSchema }),
    name: yup.string().required().min(1).max(30),
    story: StorageFileSchema,
    problemSolution: yup.string().required().min(80).max(200),
    images: yup.array().required().of(StorageFileSchema).max(2),
    rationale: yup.string().required().min(80).max(400),
  });
