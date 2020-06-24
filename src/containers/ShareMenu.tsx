import {
  Button,
  ButtonProps,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from '@material-ui/core';
import { Share } from '@material-ui/icons';
import { useBoolean } from 'ahooks';
import { IdeaModel } from 'models';
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

export interface ShareMenuProps
  extends Pick<React.ComponentProps<typeof FacebookShareButton>, 'url'>,
    Pick<IdeaModel, 'shareCount'>,
    Omit<ButtonProps, 'color' | 'onClick'> {}

const iconSize = 34;

export const ShareMenu: React.FC<ShareMenuProps> = ({
  shareCount,
  url,
  style,
  ...props
}) => {
  const theme = useTheme();

  const [menuOpen, { toggle }] = useBoolean();

  return (
    <>
      <Tooltip placement="top" title={`Unique share count is ${shareCount}`}>
        <Button
          {...props}
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
        open={menuOpen}
        onClose={() => {
          toggle();
        }}
      >
        <MenuItem>
          <FacebookShareButton url={url}>
            <ListItem>
              <ListItemIcon>
                <FacebookIcon size={iconSize} round />
              </ListItemIcon>
              <ListItemText>Facebook</ListItemText>
            </ListItem>
          </FacebookShareButton>
        </MenuItem>
        <MenuItem>
          <TwitterShareButton url={url}>
            <ListItem>
              <ListItemIcon>
                <TwitterIcon size={iconSize} round />
              </ListItemIcon>
              <ListItemText>Twitter</ListItemText>
            </ListItem>
          </TwitterShareButton>
        </MenuItem>
        <MenuItem>
          <LinkedinShareButton url={url}>
            <ListItem>
              <ListItemIcon>
                <LinkedinIcon size={iconSize} round />
              </ListItemIcon>
              <ListItemText>Linkedin</ListItemText>
            </ListItem>
          </LinkedinShareButton>
        </MenuItem>
        <MenuItem>
          <WhatsappShareButton url={url}>
            <ListItem>
              <ListItemIcon>
                <WhatsappIcon size={iconSize} round />
              </ListItemIcon>
              <ListItemText>Whatsapp</ListItemText>
            </ListItem>
          </WhatsappShareButton>
        </MenuItem>
        <MenuItem>
          <ViberShareButton url={url}>
            <ListItem>
              <ListItemIcon>
                <ViberIcon size={iconSize} round />
              </ListItemIcon>
              <ListItemText>Viber</ListItemText>
            </ListItem>
          </ViberShareButton>
        </MenuItem>
      </Menu>
    </>
  );
};
