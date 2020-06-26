import { CheckboxProps } from '@material-ui/core';
import { FieldInputProps } from 'formik';
import { CSSProperties, SVGAttributes } from 'react';

export type IconProps = SVGAttributes<HTMLOrSVGElement>;

export type CheckFieldProps = Omit<FieldInputProps<boolean>, 'onChange'> & {
  onChange: CheckboxProps['onChange'];
};

export type GetCheckFieldProps = (name: string) => CheckFieldProps;

export interface WithStyle {
  style: CSSProperties;
}
