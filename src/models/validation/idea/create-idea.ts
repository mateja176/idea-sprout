import { CreationIdea } from 'models';
import * as yup from 'yup';
import { checkSchema, PathSchema } from './idea';

export const ideaSchemaDefinition: yup.ObjectSchemaDefinition<CreationIdea> = {
  niche: checkSchema,
  expectations: checkSchema,
  name: yup.string().required().min(1).max(30),
  storyPath: PathSchema,
  problemSolution: yup.string().required().min(80).max(201),
  imagePaths: yup.array().required().of(PathSchema).max(2),
  rationale: yup.string().required().min(100).max(401),
  shareCount: yup
    .number()
    .required()
    .test(
      'skipShareWarning',
      'Ideas which are shared have a higher chance of catching on. Are you sure you want to skip this step?',
      function (value) {
        console.log(value, (this.options.context as CreationIdea)?.doNotShare);

        return !value && !(this.options.context as CreationIdea)?.doNotShare;
      },
    ),
  doNotShare: yup.boolean(),
};
