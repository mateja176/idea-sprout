import Box from '@material-ui/core/Box';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';
import {
  ShareOptionConfig,
  ShareOptionProvider,
} from '../../components/share/share';
import { shareIconSize } from '../../utils/styles/styles';

export const ShareMenuItem = React.forwardRef<
  HTMLLIElement,
  {
    config: ShareOptionConfig;
    url: string;
    shareIdea: (provider: ShareOptionProvider) => void;
  }
>(({ config, url, shareIdea }, ref) => {
  const onShareWindowClose = React.useCallback(
    () => shareIdea(config.provider),
    [shareIdea, config.provider],
  );

  return (
    <MenuItem ref={ref} key={config.label}>
      <config.Button
        key={config.label}
        url={url}
        onShareWindowClose={onShareWindowClose}
      >
        <Box display="flex" alignItems="center" my={'3px'}>
          <ListItemIcon>
            <config.Icon size={shareIconSize} />
          </ListItemIcon>
          <ListItemText>{config.label}</ListItemText>
        </Box>
      </config.Button>
    </MenuItem>
  );
});
