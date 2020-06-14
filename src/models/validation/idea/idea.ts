import * as yup from 'yup';

export const checkSchema = yup.bool().required();

export const URLSchema = yup.string().min(1).required();
