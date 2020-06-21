import { CreationIdea } from 'models';
import * as yup from 'yup';
import { checkSchema, StorageFileSchema } from './idea';

export const ProblemSolutionLength = {
  min: 80,
  max: 200,
};

export const RationaleLength = {
  min: 80,
  max: 400,
};

export const ideaSchemaDefinition: yup.ObjectSchemaDefinition<CreationIdea> = {
  niche: checkSchema,
  expectations: checkSchema,
  name: yup.string().required().min(1).max(30),
  story: StorageFileSchema,
  problemSolution: yup
    .string()
    .required()
    .min(ProblemSolutionLength.min)
    .max(ProblemSolutionLength.max),
  images: yup.array().required().of(StorageFileSchema).max(2),
  rationale: yup
    .string()
    .required()
    .min(RationaleLength.min)
    .max(RationaleLength.max),
};
