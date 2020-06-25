import { IdeaModel } from 'models';

export const getRatingHelperText = (rating: IdeaModel['rating']) =>
  `Average rating ${rating.average} out of total ${rating.total}`;
