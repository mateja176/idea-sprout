import { CheckboxProps } from '@material-ui/core/Checkbox';
import { FormControlProps } from '@material-ui/core/FormControl';
import firebase from 'firebase/app';
import { IndexRange } from 'react-virtualized';
import * as yup from 'yup';
import { User } from './auth';
import { WithAuthor, WithId } from './models';

export const checkNames = ['niche', 'expectations'] as const;
export type CheckNames = typeof checkNames;
export type CheckName = CheckNames[number];

export interface CheckProps
  extends Pick<FormControlProps, 'disabled'>,
    Pick<CheckboxProps, 'checked' | 'onChange' | 'name' | 'onBlur'>,
    Pick<React.CSSProperties, 'height'> {
  label: string;
  description: React.ReactNode;
  errorMessage?: string;
}
export type SetCheck = (
  name: keyof IdeaModel['checks'],
) => CheckProps['onChange'];

export const ideaStatuses = ['seed', 'sprout', 'bloom', 'shrivel'] as const;
export type IdeaStatuses = typeof ideaStatuses;
export type IdeaStatus = IdeaStatuses[number];
export type IdeaStatusRecord = { [key in IdeaStatus]: key };

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

export interface Rating {
  average: number;
  count: number;
}

export interface IdeaModel extends WithId, WithAuthor {
  createdAt: firebase.firestore.Timestamp;
  /**
   * the checks are a way of guiding creators towards publishing high quality ideas
   */
  checks: { [key in CheckName]: boolean };
  status: IdeaStatus;
  sharedBy: Record<User['uid'], true | undefined>;
  name: string;
  logo: StorageFile;
  tagline: string;
  story: StorageFile;
  problemSolution: string;
  images: StorageFile[];
  rationale: string;
  averageRating: number;
  ratingCount: number;
}

export type InitialIdea = Omit<RawIdea, 'createdAt'>;

export type RawIdea = Omit<IdeaModel, 'id'>;

export type CreationIdea = Omit<RawIdea, 'createdAt'> & {
  createdAt: firebase.firestore.FieldValue;
};

export type FormIdea = Omit<
  IdeaModel,
  'id' | 'author' | 'createdAt' | 'checks' | 'status' | 'sharedBy'
>;

export enum NameLength {
  min = 2,
  max = 30,
}

export enum TaglineLength {
  min = 20,
  max = 60,
}

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
    name: yup.string().required().min(NameLength.min).max(NameLength.max),
    logo: StorageFileSchema,
    tagline: yup
      .string()
      .required()
      .min(TaglineLength.min)
      .max(TaglineLength.max),
    story: StorageFileSchema,
    problemSolution: yup
      .string()
      .required('Problem-solution field is required')
      .min(ProblemSolutionLength.min)
      .max(ProblemSolutionLength.max),
    images: yup.array().required().of(StorageFileSchema).max(2),
    rationale: yup
      .string()
      .required()
      .min(RationaleLength.min)
      .max(RationaleLength.max),
    averageRating: yup.number().required().positive(),
    ratingCount: yup.number().required().positive(),
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

export type IdeaSprout = Omit<IdeaModel, 'status'> & {
  status: IdeaStatusRecord['sprout'];
};

export interface IdeasState {
  ideas: Array<'loading' | IdeaSprout | IdeaBatchError | undefined>;
}

export const headingIds = {
  name: 'name',
  tagline: 'name',
  problemSolution: 'problem-solution',
  rationale: 'rationale',
};

export type UpdateStorageFile = (file: StorageFile) => Promise<void>;

export interface IdeaFilter<Key extends keyof IdeaModel> {
  fieldPath: Key;
  opStr: firebase.firestore.WhereFilterOp;
  value: IdeaModel[Key];
}

export interface WithPreloadedIdea {
  __PRELOADED_IDEA__?: IdeaModel;
}

export type GlobalWithPreloadedIdea = typeof globalThis & WithPreloadedIdea;
