import { Box, ButtonProps, Tooltip } from '@material-ui/core';
import React from 'react';
import { shareOptions } from './share';

export const shareOptionSize = 50;
export const shareOptionMr = 1;

export const ShareOptionsWrapper: React.FC = ({ children }) => (
  <Box mt={1} display="flex" flexWrap="wrap">
    {children}
  </Box>
);

export const ShareOptions: React.FC<
  Pick<ButtonProps, 'disabled'> & { ideaUrl: string; shareIdea: () => void }
> = ({ ideaUrl, shareIdea, disabled }) => (
  <ShareOptionsWrapper>
    {shareOptions.map((option) => (
      <Tooltip key={option.label} placement="top" title={option.label}>
        <Box mr={shareOptionMr}>
          <option.Button
            disabled={disabled}
            url={ideaUrl}
            onShareWindowClose={shareIdea}
          >
            <option.Icon size={shareOptionSize} />
          </option.Button>
        </Box>
      </Tooltip>
    ))}
  </ShareOptionsWrapper>
);
