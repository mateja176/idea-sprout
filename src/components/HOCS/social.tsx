import { SocialIconProps } from 'models';
import React from 'react';
import { FacebookIcon } from 'react-share';

export const withSocialIconAdapter = (Icon: typeof FacebookIcon) => ({
  size,
}: SocialIconProps) => <Icon round style={{ width: size, height: size }} />;
