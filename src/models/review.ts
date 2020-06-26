import * as yup from 'yup';
import { WithAuthor, WithId } from './models';

export interface Review extends WithId, WithAuthor {
  rating: number;
  feedback: string;
}

export type CreationReview = Omit<Review, 'id' | 'author'> & {
  shared: boolean;
  doNotShare: boolean;
};

export enum FeedbackLength {
  min = 40,
}
export const createReviewSchema = yup
  .object()
  .required()
  .shape<CreationReview>({
    rating: yup.number().required().min(1).max(5),
    feedback: yup.string().required().min(FeedbackLength.min),
    shared: yup.bool().required(),
    doNotShare: yup
      .bool()
      .required()
      .notOneOf(
        [yup.ref('shared')],
        'Share the idea to help it grow, or just tick the above checkbox',
      ),
  });

export const initialCreationReview: CreationReview = {
  rating: 0,
  feedback: '',
  shared: false,
  doNotShare: false,
};

export interface RatingConfig {
  average: number;
  count: number;
}
