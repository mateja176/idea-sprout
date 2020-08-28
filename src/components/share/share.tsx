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
import { ShareButtonProps, ShareIconProps } from '../../models/models';

interface RawShareConfig {
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

export const rawShareOption: Record<ShareKey, RawShareConfig> = {
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

type RawShareOption = typeof rawShareOption;

export type ShareOption = {
  [key in keyof RawShareOption]: RawShareOption[key] & { provider: key };
};

export type ShareOptionProvider = keyof ShareOption;
export type ShareOptionConfig = ShareOption[ShareOptionProvider];

export const shareOption = Object.fromEntries(
  Object.entries(rawShareOption).map(([key, { Button, Icon, ...config }]) => [
    key,
    {
      ...config,
      provider: key,
      Button: ({ type = 'button', ...props }) => (
        <Button {...props} type={type} />
      ),
      Icon: ({ round = true, ...props }) => <Icon {...props} round={round} />,
    },
  ]),
) as ShareOption;

export const shareOptions = Object.values(shareOption);
