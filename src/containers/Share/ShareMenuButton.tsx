import Button, { ButtonProps } from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Share from '@material-ui/icons/Share';
import { useBoolean } from 'ahooks';
import React from 'react';
import { FacebookShareButton } from 'react-share';
import { ShareOptionProvider } from '../../components/share/share';
import { getShareCountHelperText } from '../../utils/idea/idea';
import { ShareMenu } from './ShareMenu';

export const ShareMenuButton = React.memo<
  Pick<React.ComponentProps<typeof FacebookShareButton>, 'url'> &
    Pick<ButtonProps, 'style'> & {
      shareCount: number;
      shareIdea: (provider: ShareOptionProvider) => void;
    }
>(({ shareCount, url, style, shareIdea }) => {
  const [menuOpen, { toggle }] = useBoolean();

  const buttonRef = React.useRef<HTMLButtonElement | null>(null);

  const handleClick = React.useCallback(() => {
    toggle();
  }, [toggle]);

  return (
    <>
      <Tooltip placement={'top'} title={getShareCountHelperText(shareCount)}>
        <Button
          style={style}
          ref={buttonRef}
          onClick={handleClick}
          endIcon={<Share fontSize="small" color="primary" />}
          aria-label={'Share'}
        >
          {shareCount}
        </Button>
      </Tooltip>
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
