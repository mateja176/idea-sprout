import { convertToRaw, EditorState } from 'draft-js';
import firebase from 'firebase/app';
import {
  FormIdea,
  IdeaModel,
  IdeaSprout,
  IdeasState,
  initialRawIdea,
  RawIdea,
  StorageFile,
} from 'models';

export const ideasFetchLimit = 15;

export const getShareCountHelperText = (count: number) =>
  `Shared by ${count} ${count === 1 ? 'person' : 'people'}`;

export const getFormIdea = ({
  name,
  story,
  problemSolution,
  images,
  rationale,
  ratingCount,
  averageRating,
}: RawIdea): FormIdea => ({
  name,
  story,
  problemSolution,
  images,
  rationale,
  ratingCount,
  averageRating,
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

export function isIdea(idea: IdeasState['ideas'][number]): idea is IdeaSprout {
  return !!idea && idea !== 'loading' && !(idea instanceof Error);
}

export const getInitialIdea = (author: IdeaModel['author']): RawIdea => ({
  ...initialRawIdea,
  author,
  createdAt: firebase.firestore.Timestamp.now(),
  sharedBy: {},
  status: 'seed',
  name: 'Apple Computers',
  problemSolution:
    'Computers are an invaluable source of information, they save precious time and help us connect with other people. Computers make our lives better.',
  story: {
    path: 'videos/placeholder-story.mp4',
    width: 1920,
    height: 1080,
  },
  images: [
    {
      path: 'images/placeholder-image.png',
      width: 1920,
      height: 1080,
    },
  ],
  rationale:
    'Computers enable us to write messages, talk to friends and family, watch videos, share images, learn and teach others, manage finances, buy online, manage calendars, look up addresses, translate text, play games and many more things',
});
