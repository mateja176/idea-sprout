import { withShareIconAdapter } from 'components';
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
import { ShareButtonProps, ShareIconProps } from '../models/models';

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

export const shareConfig: Record<ShareKey, ShareConfig> = {
  // * there's no way of determining whether the user actually shared the link
  // copyLink: {
  //   label: 'Copy Link',
  //   Button: CopyUrl,
  //   Icon: CopyUrlIcon,
  // },
  facebook: {
    label: 'Facebook',
    Button: FacebookShareButton,
    Icon: withShareIconAdapter(FacebookIcon),
  },
  twitter: {
    label: 'Twitter',
    Button: TwitterShareButton,
    Icon: withShareIconAdapter(TwitterIcon),
  },
  linkedin: {
    label: 'Linkedin',
    Button: LinkedinShareButton,
    Icon: withShareIconAdapter(LinkedinIcon),
  },
  whatsapp: {
    label: 'Whatsapp',
    Button: WhatsappShareButton,
    Icon: withShareIconAdapter(WhatsappIcon),
  },
  viber: {
    label: 'Viber',
    Button: ViberShareButton,
    Icon: withShareIconAdapter(ViberIcon),
  },
};

export const sharingOptions = Object.values(shareConfig);
