import * as yup from 'yup';
import { WithAuthor, WithId } from './models';

export interface Review extends WithId, WithAuthor {
  rating: number;
  feedback: string;
}

export enum FeedbackLength {
  min = 40,
}

export const initialReview: Review = {
  id: '',
  author: '',
  rating: 0,
  feedback: 'W'.repeat(FeedbackLength.min),
};

export type CreationReview = Omit<Review, 'id' | 'author'>;
export const createReviewSchema = yup
  .object()
  .required()
  .shape<CreationReview>({
    rating: yup.number().required().min(1).max(5),
    feedback: yup.string().required().min(FeedbackLength.min),
  });

export const initialCreationReview: CreationReview = {
  rating: 0,
  feedback: '',
};

export interface RatingConfig {
  average: number;
  count: number;
}
