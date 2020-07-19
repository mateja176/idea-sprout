import { Button, ButtonProps } from '@material-ui/core';
import { Share } from '@material-ui/icons';
import { useBoolean } from 'ahooks';
import React from 'react';
import { FacebookShareButton } from 'react-share';
import { getShareCountHelperText } from 'utils';
import { ShareMenu } from './ShareMenu';

export const ShareMenuButton = React.memo<
  Pick<React.ComponentProps<typeof FacebookShareButton>, 'url'> &
    Pick<ButtonProps, 'style'> & {
      shareCount: number;
      shareIdea: () => void;
    }
>(({ shareCount, url, style, shareIdea }) => {
  const [menuOpen, { toggle }] = useBoolean();

  const buttonRef = React.useRef<HTMLButtonElement | null>(null);

  const handleClick = React.useCallback(() => {
    toggle();
  }, [toggle]);

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
      <ShareMenu
        anchorEl={buttonRef.current}
        open={menuOpen}
        onClose={handleClick}
        url={url}
        shareIdea={shareIdea}
      />
    </>
  );
});
