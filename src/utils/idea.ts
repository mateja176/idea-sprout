import {
  FormIdea,
  IdeaModel,
  RatingConfig,
  RawIdea,
  StorageFile,
  User,
} from 'models';

export const getRatingHelperText = (rating: RatingConfig) =>
  `Average rating ${rating.average} out of total ${rating.count}`;

export const getShareCountHelperText = (count: number) =>
  `Shared by ${count} ${count === 1 ? 'person' : 'people'}`;

export const getFormIdea = ({
  checks,
  name,
  story,
  problemSolution,
  images,
  rationale,
}: RawIdea): FormIdea => ({
  name,
  story,
  problemSolution,
  images,
  rationale,
});

export const getFileName = (file: StorageFile) =>
  file.path.split('/').slice(-1);

export const getFileNames = (files: StorageFile[]) =>
  files.flatMap(getFileName);

export const getIsAuthor = (user: User) => (idea: IdeaModel) =>
  user.email === idea.author;
