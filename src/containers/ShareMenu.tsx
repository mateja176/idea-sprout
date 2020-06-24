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
import { IdeaModel, socialMediaConfigs } from 'models';
import React from 'react';
import { FacebookShareButton } from 'react-share';
import { shareIconSize } from 'styles';

export interface ShareMenuProps
  extends Pick<React.ComponentProps<typeof FacebookShareButton>, 'url'>,
    Pick<IdeaModel, 'shareCount'>,
    Omit<ButtonProps, 'color' | 'onClick'> {}

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
      <Tooltip placement="top" title={`Unique share count is ${shareCount}`}>
        <Button
          {...props}
          ref={buttonRef}
          style={{
            ...style,
            color: theme.palette.primary.main,
          }}
          onClick={(e) => {
            toggle();
          }}
        >
          <Share />
        </Button>
      </Tooltip>
      <Menu
        anchorEl={buttonRef.current}
        open={menuOpen}
        onClose={() => {
          toggle();
        }}
      >
        {socialMediaConfigs.map((config) => (
          <MenuItem>
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
