import { RatingConfig } from 'models';

export const getRatingHelperText = (rating: RatingConfig) =>
  `Average rating ${rating.average} out of total ${rating.count}`;
