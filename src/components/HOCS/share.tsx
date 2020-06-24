import { ShareIconProps } from 'models';
import React from 'react';
import { FacebookIcon } from 'react-share';

export const withShareIconAdapter = (Icon: typeof FacebookIcon) => ({
  size,
}: ShareIconProps) => <Icon round style={{ width: size, height: size }} />;
