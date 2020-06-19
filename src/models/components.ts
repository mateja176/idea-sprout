import { CheckboxProps } from '@material-ui/core';
import { FieldInputProps } from 'formik';
import { SVGAttributes } from 'react';
import { IdeaModel } from './idea';

export type IconProps = SVGAttributes<HTMLOrSVGElement>;

export type CheckFieldNames = keyof IdeaModel['checks'];

export type CheckFieldProps = Omit<FieldInputProps<boolean>, 'onChange'> & {
  onChange: CheckboxProps['onChange'];
};

export type GetCheckFieldProps = (name: CheckFieldNames) => CheckFieldProps;
