import Badge, { BadgeProps } from '@material-ui/core/Badge';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Tooltip from '@material-ui/core/Tooltip';
import ShareIcon from '@material-ui/icons/Share';
import SpeedDial, { SpeedDialProps } from '@material-ui/lab/SpeedDial';
import SpeedDialAction, {
  SpeedDialActionProps,
} from '@material-ui/lab/SpeedDialAction';
import useBoolean from 'ahooks/es/useBoolean';
import { shareOptions } from 'components/share/share';
import React from 'react';
import FacebookShareButton from 'react-share/es/FacebookShareButton';
import { getShareCountHelperText } from 'utils/idea/idea';
import { shareIconSize, speedDialZIndex } from 'utils/styles/styles';

interface StyleProps {
  i: number;
  isOver: boolean;
}

const fabProps: SpeedDialProps['FabProps'] = {
  size: 'small',
};

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
  const [isOver, setIsOver] = useBoolean();

  const classes = useStyles({ i, isOver });

  const [shareOptionsOpen, setShareOptionsOpen] = useBoolean();

  const badgeClasses: BadgeProps['classes'] = React.useMemo(
    () => ({
      badge: classes.badge,
    }),
    [classes.badge],
  );
  const speedDialClasses: SpeedDialActionProps['classes'] = React.useMemo(
    () => ({
      root: classes.root,
      fab: classes.fab,
      actions: classes.actions,
    }),
    [classes],
  );

  const handleMouseEnter: SpeedDialProps['onMouseEnter'] = React.useCallback(() => {
    setShareOptionsOpen.setTrue();

    setIsOver.setTrue();
  }, [setShareOptionsOpen, setIsOver]);

  const handleMouseLeave: SpeedDialProps['onMouseLeave'] = React.useCallback(() => {
    setShareOptionsOpen.setFalse();

    setIsOver.setFalse();
  }, [setShareOptionsOpen, setIsOver]);

  return (
    <Tooltip placement="top" title={getShareCountHelperText(shareCount)}>
      <Badge badgeContent={shareCount} classes={badgeClasses} showZero>
        <SpeedDial
          ariaLabel="Share options"
          icon={<ShareIcon fontSize="small" />}
          open={shareOptionsOpen}
          direction="down"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          FabProps={fabProps}
          classes={speedDialClasses}
        >
          {shareOptions.map((config) => (
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
