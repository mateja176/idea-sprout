import { Box, ListItemIcon, ListItemText, MenuItem } from '@material-ui/core';
import { ShareConfig } from 'components';
import React from 'react';
import { shareIconSize } from 'styles';

export const ShareMenuItem: React.FC<{
  config: ShareConfig;
  url: string;
  shareIdea: () => void;
}> = ({ config, url, shareIdea }) => (
  <MenuItem key={config.label}>
    <config.Button key={config.label} url={url} onShareWindowClose={shareIdea}>
      <Box display="flex" alignItems="center" my={'3px'}>
        <ListItemIcon>
          <config.Icon size={shareIconSize} />
        </ListItemIcon>
        <ListItemText>{config.label}</ListItemText>
      </Box>
    </config.Button>
  </MenuItem>
);
