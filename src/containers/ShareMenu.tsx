import {
  Box,
  Button,
  ButtonProps,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from '@material-ui/core';
import { Share } from '@material-ui/icons';
import { useBoolean } from 'ahooks';
import React from 'react';
import { FacebookShareButton } from 'react-share';
import { shareIconSize } from 'styles';
import { getShareCountHelperText } from 'utils';
import { sharingOptions } from './share';

export interface ShareMenuProps
  extends Pick<React.ComponentProps<typeof FacebookShareButton>, 'url'>,
    Omit<ButtonProps, 'color' | 'onClick'> {
  shareCount: number;
}

export const ShareMenu: React.FC<ShareMenuProps> = ({
  shareCount,
  url,
  style,
  ...props
}) => {
  const theme = useTheme();

  const [menuOpen, { toggle }] = useBoolean();

  const buttonRef = React.useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <Tooltip placement="top" title={getShareCountHelperText(shareCount)}>
        <Button
          {...props}
          ref={buttonRef}
          style={{
            ...style,
            color: theme.palette.primary.main,
          }}
          onClick={() => {
            toggle();
          }}
          endIcon={<Share />}
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
        {sharingOptions.map((config) => (
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
};
