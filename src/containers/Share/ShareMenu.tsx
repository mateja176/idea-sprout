import Menu, { MenuProps } from '@material-ui/core/Menu';
import { shareOptions } from 'components/share/share';
import React from 'react';
import { ShareMenuItem } from './ShareMenuItem';

export const ShareMenu: React.FC<
  Pick<React.ComponentProps<typeof ShareMenuItem>, 'url' | 'shareIdea'> &
    Required<Pick<MenuProps, 'anchorEl'>> &
    Pick<MenuProps, 'open' | 'onClose'>
> = ({ anchorEl, open, onClose, url, shareIdea }) => (
  <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
    {shareOptions.map((config) => (
      <ShareMenuItem
        key={config.label}
        url={url}
        shareIdea={shareIdea}
        config={config}
      />
    ))}
  </Menu>
);
