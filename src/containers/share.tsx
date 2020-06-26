import { ShareButtonProps, ShareIconProps } from 'models';
import React from 'react';
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  ViberIcon,
  ViberShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';

export interface ShareConfig {
  label: string;
  Button: React.ComponentType<ShareButtonProps>;
  Icon: React.ComponentType<ShareIconProps>;
}

export const shareKeys = [
  // 'copyLink',
  'facebook',
  'twitter',
  'linkedin',
  'whatsapp',
  'viber',
] as const;
export type ShareKeys = typeof shareKeys;
export type ShareKey = ShareKeys[number];

export const rawShareConfig: Record<ShareKey, ShareConfig> = {
  // * there's no way of determining whether the user actually shared the link
  // copyLink: {
  //   label: 'Copy Link',
  //   Button: CopyUrl,
  //   Icon: CopyUrlIcon,
  // },
  facebook: {
    label: 'Facebook',
    Button: FacebookShareButton,
    Icon: FacebookIcon,
  },
  twitter: {
    label: 'Twitter',
    Button: TwitterShareButton,
    Icon: TwitterIcon,
  },
  linkedin: {
    label: 'Linkedin',
    Button: LinkedinShareButton,
    Icon: LinkedinIcon,
  },
  whatsapp: {
    label: 'Whatsapp',
    Button: WhatsappShareButton,
    Icon: WhatsappIcon,
  },
  viber: {
    label: 'Viber',
    Button: ViberShareButton,
    Icon: ViberIcon,
  },
};

export const shareConfig = Object.fromEntries(
  Object.entries(rawShareConfig).map(([key, { Button, Icon, ...config }]) => [
    key,
    {
      ...config,
      Button: ({ type = 'button', ...props }) => (
        <Button {...props} type={type} />
      ),
      Icon: ({ round = true, ...props }) => <Icon {...props} round={round} />,
    },
  ]),
) as typeof rawShareConfig;

export const sharingOptions = Object.values(shareConfig);