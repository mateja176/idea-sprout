import * as yup from 'yup';
import { WithId } from './models';

export interface RawReview {
  rating: number;
  feedback: string;
}
export interface Review extends RawReview, WithId {}

export enum FeedbackLength {
  min = 40,
}

export const initialReview: Review = {
  id: '',
  rating: 0,
  feedback:
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque facilis vitae quaerat ullam illum deserunt doloribus omnis eaque dolor laboriosam et harum excepturi, non impedit quisquam nulla corrupti!',
};

export type CreationReview = Omit<Review, 'id'>;
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
