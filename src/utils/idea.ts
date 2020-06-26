import { FormIdea, RatingConfig, RawIdea } from 'models';

export const getRatingHelperText = (rating: RatingConfig) =>
  `Average rating ${rating.average} out of total ${rating.count}`;

export const getFormIdea = ({
  checks,
  name,
  story,
  problemSolution,
  images,
  rationale,
}: RawIdea): FormIdea => ({
  checks,
  name,
  story,
  problemSolution,
  images,
  rationale,
});
