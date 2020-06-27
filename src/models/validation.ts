import * as yup from 'yup';

export const authorSchema = yup.string().required().email();

export const checkSchema = yup.bool().required('Check is required');
