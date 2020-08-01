import { User } from 'firebase';
import { CSSProperties, SVGAttributes } from 'react';
import { User as UserModel } from './auth';

export interface LayoutChildrenProps {
  user: User | UserModel | null;
  emailVerified: boolean;
  setEmailVerified: () => void;
}

export type IconProps = SVGAttributes<HTMLOrSVGElement>;

export interface WithStyle {
  style: CSSProperties;
}
