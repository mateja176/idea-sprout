import firebase from 'firebase/app';
import 'firebase/firestore';
import { IndexRange } from 'react-virtualized';
import * as yup from 'yup';
import { IdeaFilter } from './firebase';
import { WithAuthor, WithId } from './models';

export const checkNames = ['niche', 'expectations'] as const;
export type CheckNames = typeof checkNames;
export type CheckName = CheckNames[number];

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

export const StorageFileSchema = yup.object().required().shape<StorageFile>({
  path: yup.string().required(),
  width: yup.number().required(),
  height: yup.number().required(),
});

export interface IdeaModel extends WithId, WithAuthor {
  createdAt: firebase.firestore.Timestamp;
  /**
   * the checks are a way of guiding creators towards publishing high quality ideas
   */
  checks: { [key in CheckName]: boolean };
  status: IdeaStatus;
  sharedBy: string[];
  name: string;
  story: StorageFile;
  problemSolution: string;
  images: StorageFile[];
  rationale: string;
  rating: {
    average: number;
    count: number;
  };
}

export const initialIdea: IdeaModel = {
  id: '',
  author: '',
  createdAt: firebase.firestore.Timestamp.now(),
  sharedBy: [],
  status: 'seed',
  checks: {
    niche: false,
    expectations: false,
  },

  name: '',
  story: { path: '', width: 0, height: 0 },
  problemSolution: '',
  images: [],
  rationale: '',
  rating: {
    average: 0,
    count: 0,
  },
};

export type RawIdea = Omit<IdeaModel, 'id'>;

export type FormIdea = Omit<
  IdeaModel,
  'id' | 'author' | 'createdAt' | 'checks' | 'status' | 'sharedBy'
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
  .shape<FormIdea>({
    name: yup.string().required().min(1).max(30),
    story: StorageFileSchema,
    problemSolution: yup
      .string()
      .required('Problem-solution field is required')
      .min(80)
      .max(200),
    images: yup.array().required().of(StorageFileSchema).max(2),
    rationale: yup.string().required().min(80).max(400),
    rating: yup.object().required().shape({
      average: yup.number().required().positive(),
      count: yup.number().required().positive(),
    }),
  });

export type UpdateIdea = (idea: Partial<RawIdea>) => Promise<void>;

export class IdeaBatchError extends Error
  implements IndexRange, IdeaFilter<keyof IdeaModel> {
  name = 'IdeaBatchError';
  constructor(
    public message: string,
    public startIndex: number,
    public stopIndex: number,
    public fieldPath: keyof IdeaModel,
    public opStr: firebase.firestore.WhereFilterOp,
    public value: IdeaModel[keyof IdeaModel],
  ) {
    super(message);
  }
}

export interface IdeasState {
  ideas: Array<'loading' | IdeaModel | IdeaBatchError | undefined>;
}
