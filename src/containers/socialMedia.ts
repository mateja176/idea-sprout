import { CopyUrlIcon, withSocialIconAdapter } from 'components';
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
import { SocialButtonProps, SocialIconProps } from '../models/models';
import { CopyUrl } from './Idea/CopyUrl';

export interface SocialMediaConfig {
  label: string;
  Button: React.ComponentType<SocialButtonProps>;
  Icon: React.ComponentType<SocialIconProps>;
}

export const socialMediaKeys = [
  'copyLink',
  'facebook',
  'twitter',
  'linkedin',
  'whatsapp',
  'viber',
] as const;
export type SocialMediaKeys = typeof socialMediaKeys;
export type SocialMediaKey = SocialMediaKeys[number];

export const socialMediaConfig: Record<SocialMediaKey, SocialMediaConfig> = {
  copyLink: {
    label: 'Copy Link',
    Button: CopyUrl,
    Icon: CopyUrlIcon,
  },
  facebook: {
    label: 'Facebook',
    Button: FacebookShareButton,
    Icon: withSocialIconAdapter(FacebookIcon),
  },
  twitter: {
    label: 'Twitter',
    Button: TwitterShareButton,
    Icon: withSocialIconAdapter(TwitterIcon),
  },
  linkedin: {
    label: 'Linkedin',
    Button: LinkedinShareButton,
    Icon: withSocialIconAdapter(LinkedinIcon),
  },
  whatsapp: {
    label: 'Whatsapp',
    Button: WhatsappShareButton,
    Icon: withSocialIconAdapter(WhatsappIcon),
  },
  viber: {
    label: 'Viber',
    Button: ViberShareButton,
    Icon: withSocialIconAdapter(ViberIcon),
  },
};

export const socialMediaConfigs = Object.values(socialMediaConfig);
