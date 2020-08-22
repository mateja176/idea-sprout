import { FacebookIcon, FacebookShareButton } from 'react-share';

export interface WithId {
  id: string;
}

export interface WithAuthor {
  author: string;
}

export interface WithCount {
  count: number;
}

export interface ShareButtonProps
  extends React.ComponentProps<typeof FacebookShareButton> {}

export interface ShareIconProps
  extends React.ComponentProps<typeof FacebookIcon> {}
