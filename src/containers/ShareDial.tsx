import { Badge, makeStyles, Tooltip } from '@material-ui/core';
import { Share as ShareIcon } from '@material-ui/icons';
import { SpeedDial, SpeedDialAction } from '@material-ui/lab';
import React from 'react';
import { FacebookShareButton } from 'react-share';
import { shareIconSize, speedDialZIndex } from 'styles';
import { sharingOptions } from './share';

interface StyleProps {
  i: number;
  isOver: boolean;
}

export interface ShareProps
  extends Pick<React.ComponentProps<typeof FacebookShareButton>, 'url'>,
    Partial<Pick<StyleProps, 'i'>> {
  shareCount: number;
}

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

export const Share: React.FC<ShareProps> = ({ url, shareCount, i = 1 }) => {
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
        >
          {sharingOptions.map((config) => (
            <SpeedDialAction
              key={config.label}
              tooltipTitle={config.label}
              icon={
                <config.Button url={url}>
                  <config.Icon size={shareIconSize} />
                </config.Button>
              }
            />
          ))}
        </SpeedDial>
      </Badge>
    </Tooltip>
  );
};
