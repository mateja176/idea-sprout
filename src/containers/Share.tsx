import { Badge, makeStyles, Tooltip } from '@material-ui/core';
import { Link, Share as ShareIcon } from '@material-ui/icons';
import { SpeedDial, SpeedDialAction } from '@material-ui/lab';
import { IdeaModel } from 'models';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
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
import { createQueueSnackbar, useActions } from 'services';
import { speedDialZIndex } from 'styles';

interface StyleProps {
  i: number;
  isOver: boolean;
}

export interface ShareProps
  extends Pick<React.ComponentProps<typeof FacebookShareButton>, 'url'>,
    Pick<IdeaModel, 'shareCount'>,
    Partial<Pick<StyleProps, 'i'>> {}

const iconSize = 48;

const getZIndex = ({ i }: StyleProps) => speedDialZIndex - i;

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: getZIndex,
  },
  fab: {
    boxShadow: ({ isOver }: StyleProps) =>
      isOver ? theme.shadows[13] : 'none',
  },
  actions: {
    position: 'absolute',
    marginTop: '0 !important',
    zIndex: getZIndex,
  },
  badge: {
    zIndex: getZIndex,
    background: theme.palette.grey[600],
    color: theme.palette.common.white,
  },
}));

const handleIconClick: React.MouseEventHandler = (e) => {
  e.stopPropagation();
};

export const Share: React.FC<ShareProps> = ({ url, shareCount, i = 1 }) => {
  const { queueSnackbar } = useActions({ queueSnackbar: createQueueSnackbar });

  const [isOver, setIsOver] = React.useState(false);
  const toggleIsOver = () => {
    setIsOver(!isOver);
  };

  const classes = useStyles({ i, isOver });

  const [shareOptionsOpen, setShareOptionsOpen] = React.useState(false);

  return (
    <Tooltip placement="top" title={`Unique share count is ${shareCount}`}>
      <Badge
        badgeContent={shareCount}
        classes={{
          badge: classes.badge,
        }}
        showZero
      >
        <SpeedDial
          ariaLabel="Share options"
          icon={<ShareIcon fontSize="small" />}
          open={shareOptionsOpen}
          direction="down"
          onMouseEnter={() => {
            setShareOptionsOpen(true);

            toggleIsOver();
          }}
          onMouseLeave={() => {
            setShareOptionsOpen(false);

            toggleIsOver();
          }}
          FabProps={{
            size: 'small',
          }}
          classes={{
            root: classes.root,
            fab: classes.fab,
            actions: classes.actions,
          }}
          onClick={handleIconClick}
        >
          <SpeedDialAction
            tooltipTitle="Copy link"
            onClick={handleIconClick}
            icon={
              <CopyToClipboard
                text={url}
                onCopy={() => {
                  queueSnackbar({
                    severity: 'info',
                    message: 'Link to idea copied',
                  });
                }}
              >
                <Link />
              </CopyToClipboard>
            }
          />
          <SpeedDialAction
            tooltipTitle="Share on Facebook"
            onClick={handleIconClick}
            icon={
              <FacebookShareButton url={url}>
                <FacebookIcon size={iconSize} round />
              </FacebookShareButton>
            }
          />
          <SpeedDialAction
            tooltipTitle="Share on Twitter"
            onClick={handleIconClick}
            icon={
              <TwitterShareButton url={url}>
                <TwitterIcon size={iconSize} round />
              </TwitterShareButton>
            }
          />
          <SpeedDialAction
            tooltipTitle="Share on Linkedin"
            onClick={handleIconClick}
            icon={
              <LinkedinShareButton url={url}>
                <LinkedinIcon size={iconSize} round />
              </LinkedinShareButton>
            }
          />
          <SpeedDialAction
            tooltipTitle="Share on Whatsapp"
            onClick={handleIconClick}
            icon={
              <WhatsappShareButton url={url}>
                <WhatsappIcon size={iconSize} round />
              </WhatsappShareButton>
            }
          />
          <SpeedDialAction
            tooltipTitle="Share on Viber"
            onClick={handleIconClick}
            icon={
              <ViberShareButton url={url}>
                <ViberIcon size={iconSize} round />
              </ViberShareButton>
            }
          />
        </SpeedDial>
      </Badge>
    </Tooltip>
  );
};
