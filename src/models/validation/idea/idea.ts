import { StorageFile } from 'models/idea';
import * as yup from 'yup';

export const checkSchema = yup.bool().required();

export const StorageFileSchema = yup
  .object()
  .required()
  .shape<StorageFile>({
    path: yup.string().min(1).required(),
    width: yup.number().required(),
    height: yup.number().required(),
  });
