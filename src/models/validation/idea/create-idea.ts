import { CreationIdea } from 'models';
import * as yup from 'yup';
import { checkSchema, URLSchema } from './idea';

export const ideaSchemaDefinition: yup.ObjectSchemaDefinition<CreationIdea> = {
  niche: checkSchema,
  expectations: checkSchema,
  name: yup.string().min(1).max(30).required(),
  storyURL: URLSchema,
  problemSolution: yup.string().min(80).max(201).required(),
  imageURLs: yup.array().of(URLSchema).max(2).required(),
  rationale: yup.string().min(100).max(401).required(),
};
