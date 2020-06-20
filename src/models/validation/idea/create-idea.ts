import { CreationIdea } from 'models';
import * as yup from 'yup';
import { checkSchema, PathSchema } from './idea';

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
  storyPath: PathSchema,
  problemSolution: yup
    .string()
    .required()
    .min(RationaleLength.min)
    .max(RationaleLength.max),
  imagePaths: yup.array().required().of(PathSchema).max(2),
  rationale: yup
    .string()
    .required()
    .min(ProblemSolutionLength.min)
    .max(ProblemSolutionLength.max),
};
