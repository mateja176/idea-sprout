import { ComponentProps, CSSProperties, Suspense, SVGAttributes } from 'react';

export type IconProps = SVGAttributes<HTMLOrSVGElement>;

export interface WithStyle {
  style: CSSProperties;
}

export type WithFallback = Partial<
  Pick<ComponentProps<typeof Suspense>, 'fallback'>
>;
