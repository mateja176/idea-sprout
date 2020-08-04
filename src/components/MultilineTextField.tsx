import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import React from 'react';

export type MultilineTextFieldProps = Omit<
  TextFieldProps,
  'multiline' | 'variant'
>;

export const MultilineTextField: React.FC<MultilineTextFieldProps> = (
  props,
) => <TextField {...props} variant={'outlined'} multiline />;
