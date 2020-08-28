import Box from '@material-ui/core/Box';
import { ButtonProps } from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';
import { ShareOptionConfig, ShareOptionProvider, shareOptions } from './share';

export const shareOptionSize = 50;
export const shareOptionMr = 1;

export const ShareOptionsWrapper: React.FC = ({ children }) => (
  <Box mt={1} display="flex" flexWrap="wrap">
    {children}
  </Box>
);

interface ShareOptionProps extends Pick<ButtonProps, 'disabled'> {
  ideaUrl: string;
  shareIdea: (provider: ShareOptionProvider) => void;
}

const ShareOption: React.FC<ShareOptionProps & ShareOptionConfig> = ({
  ideaUrl,
  shareIdea,
  disabled,
  label,
  Icon,
  Button,
  provider,
}) => {
  const onShareWindowClose = React.useCallback(() => shareIdea(provider), [
    shareIdea,
    provider,
  ]);

  return (
    <Tooltip key={label} placement="top" title={label}>
      <Box mr={shareOptionMr}>
        <Button
          disabled={disabled}
          url={ideaUrl}
          onShareWindowClose={onShareWindowClose}
        >
          <Icon size={shareOptionSize} />
        </Button>
      </Box>
    </Tooltip>
  );
};

export const ShareOptions: React.FC<ShareOptionProps> = (props) => {
  return (
    <ShareOptionsWrapper>
      {shareOptions.map((config) => (
        <ShareOption {...props} {...config} />
      ))}
    </ShareOptionsWrapper>
  );
};
