import * as yup from 'yup';

export interface Review {
  id: string;
  rating: number;
  feedback: string;
}

export type RawReview = Omit<Review, 'id'>;

export type CreationReview = Omit<Review, 'id'> & {
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
        "Don't think the idea is good enough to share?",
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
