import {
  Box,
  Button,
  ButtonProps,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from '@material-ui/core';
import { Share } from '@material-ui/icons';
import { useBoolean } from 'ahooks';
import { shareOptions } from 'components';
import React from 'react';
import { FacebookShareButton } from 'react-share';
import { shareIconSize } from 'styles';
import { getShareCountHelperText } from 'utils';

export interface ShareMenuProps
  extends Pick<React.ComponentProps<typeof FacebookShareButton>, 'url'>,
    Omit<ButtonProps, 'color' | 'onClick'> {
  shareCount: number;
}

export const ShareMenu = React.memo<ShareMenuProps>(
  ({ shareCount, url, ...props }) => {
    const [menuOpen, { toggle }] = useBoolean();

    const buttonRef = React.useRef<HTMLButtonElement | null>(null);

    return (
      <>
        <Tooltip placement="top" title={getShareCountHelperText(shareCount)}>
          <Button
            {...props}
            ref={buttonRef}
            onClick={() => {
              toggle();
            }}
            endIcon={<Share fontSize="small" color="primary" />}
          >
            {shareCount}
          </Button>
        </Tooltip>
        <Menu
          anchorEl={buttonRef.current}
          open={menuOpen}
          onClose={() => {
            toggle();
          }}
        >
          {shareOptions.map((config) => (
            <MenuItem key={config.label}>
              <config.Button key={config.label} url={url}>
                <Box display="flex" alignItems="center" my={'3px'}>
                  <ListItemIcon>
                    <config.Icon size={shareIconSize} />
                  </ListItemIcon>
                  <ListItemText>{config.label}</ListItemText>
                </Box>
              </config.Button>
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  },
);
