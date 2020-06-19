import * as yup from 'yup';

export const checkSchema = yup.bool().required();

export const PathSchema = yup.string().min(1).required();
