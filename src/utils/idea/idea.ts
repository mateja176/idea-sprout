import { convertToRaw, EditorState } from 'draft-js';
import {
  FormIdea,
  IdeaModel,
  IdeasState,
  Rating,
  RawIdea,
  StorageFile,
  User,
} from 'models';

export const ideasFetchLimit = 15;

export const getRatingHelperText = (rating: Rating) =>
  `Average rating ${rating.average} out of total ${rating.count}`;

export const getShareCountHelperText = (count: number) =>
  `Shared by ${count} ${count === 1 ? 'person' : 'people'}`;

export const getFormIdea = ({
  name,
  story,
  problemSolution,
  images,
  rationale,
  rating,
}: RawIdea): FormIdea => ({
  name,
  story,
  problemSolution,
  images,
  rationale,
  rating,
});

export const getFileName = (file: StorageFile) =>
  file.path.split('/').slice(-1);

export const getFileNames = (files: StorageFile[]) =>
  files.flatMap(getFileName);

export const contentToText = (editorState: EditorState): string => {
  const text = convertToRaw(editorState.getCurrentContent())
    .blocks.reduce((text, block) => text.concat('\n', block.text), '')
    .trim();
  return text;
};

export function isIdea(idea: IdeasState['ideas'][number]): idea is IdeaModel {
  return !!idea && idea !== 'loading' && !(idea instanceof Error);
}
