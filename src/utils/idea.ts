import { IdeaModel } from 'models';

export const getRatingTooltip = (rating: IdeaModel['rating']) =>
  `Average rating ${rating.average} out of total ${rating.total}`;
