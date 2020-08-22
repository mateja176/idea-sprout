import React from 'react';
import FacebookIcon from 'react-share/es/FacebookIcon';
import FacebookShareButton from 'react-share/es/FacebookShareButton';
import LinkedinIcon from 'react-share/es/LinkedinIcon';
import LinkedinShareButton from 'react-share/es/LinkedinShareButton';
import TwitterIcon from 'react-share/es/TwitterIcon';
import TwitterShareButton from 'react-share/es/TwitterShareButton';
import ViberIcon from 'react-share/es/ViberIcon';
import ViberShareButton from 'react-share/es/ViberShareButton';
import WhatsappIcon from 'react-share/es/WhatsappIcon';
import WhatsappShareButton from 'react-share/es/WhatsappShareButton';
import { ShareButtonProps, ShareIconProps } from '../../models/models';

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

export const rawShareOption: Record<ShareKey, ShareConfig> = {
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

export const shareOption = Object.fromEntries(
  Object.entries(rawShareOption).map(([key, { Button, Icon, ...config }]) => [
    key,
    {
      ...config,
      Button: ({ type = 'button', ...props }) => (
        <Button {...props} type={type} />
      ),
      Icon: ({ round = true, ...props }) => <Icon {...props} round={round} />,
    },
  ]),
) as typeof rawShareOption;

export const shareOptions = Object.values(shareOption);
