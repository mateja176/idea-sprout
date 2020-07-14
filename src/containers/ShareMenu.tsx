import {
  Box,
  Button,
  ButtonProps,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { Share } from '@material-ui/icons';
import { useBoolean } from 'ahooks';
import { ShareConfig, shareOptions } from 'components';
import React from 'react';
import { FacebookShareButton } from 'react-share';
import { shareIconSize } from 'styles';
import { getShareCountHelperText } from 'utils';

export interface ShareMenuProps
  extends Pick<React.ComponentProps<typeof FacebookShareButton>, 'url'>,
    Pick<ButtonProps, 'style'> {
  shareCount: number;
  shareIdea: () => void;
}

export const ShareMenu = React.memo<ShareMenuProps>(
  ({ shareCount, url, style, shareIdea }) => {
    const [menuOpen, { toggle }] = useBoolean();

    const buttonRef = React.useRef<HTMLButtonElement | null>(null);

    const handleClick = React.useCallback(() => {
      toggle();
    }, [toggle]);

    const ShareMenuItem = React.useCallback(
      (config: ShareConfig) => (
        <MenuItem key={config.label}>
          <config.Button
            key={config.label}
            url={url}
            onShareWindowClose={shareIdea}
          >
            <Box display="flex" alignItems="center" my={'3px'}>
              <ListItemIcon>
                <config.Icon size={shareIconSize} />
              </ListItemIcon>
              <ListItemText>{config.label}</ListItemText>
            </Box>
          </config.Button>
        </MenuItem>
      ),
      [url],
    );

    return (
      <>
        <Button
          style={style}
          title={getShareCountHelperText(shareCount)}
          ref={buttonRef}
          onClick={handleClick}
          endIcon={<Share fontSize="small" color="primary" />}
        >
          {shareCount}
        </Button>
        <Menu
          anchorEl={buttonRef.current}
          open={menuOpen}
          onClose={handleClick}
        >
          {shareOptions.map(ShareMenuItem)}
        </Menu>
      </>
    );
  },
);
