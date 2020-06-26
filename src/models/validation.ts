import * as yup from 'yup';

export const authorSchema = yup.string().required().email();
