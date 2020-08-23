import {
  FormIdea,
  IdeaModel,
  IdeaSprout,
  IdeasState,
  InitialIdea,
  RawIdea,
  StorageFile,
} from '../../models/idea';

export const ideasFetchLimit = 15;

export const getShareCountHelperText = (count: number) =>
  `Shared by ${count} ${count === 1 ? 'person' : 'people'}`;

export const roundAverage = (average: number) => average.toFixed(1);
export const getRatingTooltip = (count: number, average: number) =>
  `Average rating ${roundAverage(average)} out of total ${count}`;

export const getFormIdea = ({
  name,
  logo,
  tagline,
  story,
  problemSolution,
  images,
  rationale,
  ratingCount,
  averageRating,
}: RawIdea): FormIdea => ({
  name,
  logo,
  tagline,
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

export function isIdea(idea: IdeasState['ideas'][number]): idea is IdeaSprout {
  return !!idea && idea !== 'loading' && !(idea instanceof Error);
}

export const problemSolutionText = `What do all successful businesses have in common? They solve a problem or fulfill a need that a certain group of people experiences. Why would they care and what would the proposed solution be?`;

export const rationaleText = `Win over the hearts of customers with your story. Win over the minds of customers with common logic.`;

const initialIdea: InitialIdea = {
  author: '',
  checks: {
    expectations: true,
    niche: true,
  },
  averageRating: 0,
  ratingCount: 0,
  sharedBy: {},
  status: 'seed',
  name: 'Idea Seed',
  logo: {
    path: 'images/idea-seed.svg',
    width: 100,
    height: 100,
  },
  tagline: 'A good tagline is brief, but memorable.',
  problemSolution: problemSolutionText,
  story: {
    path: 'videos/idea-seed.mp4',
    width: 1920,
    height: 1080,
  },
  images: [
    {
      path: 'images/idea-seed.png',
      width: 1920,
      height: 1080,
    },
  ],
  rationale: rationaleText,
};

export const getInitialIdea = (author: IdeaModel['author']) => ({
  ...initialIdea,
  author,
});

export const getAppleIdea = (author: IdeaModel['author']) => ({
  ...initialIdea,
  author,
  name: 'Apple Computers',
  tagline: 'Think different.',
  problemSolution:
    'Computers are an invaluable source of information, they save precious time and help us connect with other people. Computers make our lives better.',
  rationale:
    'Computers enable us to write messages, talk to friends and family, watch videos, share images, learn and teach others, manage finances, buy online, manage calendars, look up addresses, translate text, play games and many more things',
});
