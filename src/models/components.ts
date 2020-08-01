import { CSSProperties, SVGAttributes } from 'react';

export type IconProps = SVGAttributes<HTMLOrSVGElement>;

export interface WithStyle {
  style: CSSProperties;
}
