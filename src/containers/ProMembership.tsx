import Box from '@material-ui/core/Box';
import { ButtonProps } from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Beenhere from '@material-ui/icons/Beenhere';
import EmojiEvents from '@material-ui/icons/EmojiEvents';
import { User } from 'firebase';
import { Order } from 'models';
import React from 'react';
import { useFirestoreDoc, useOrderRef } from 'services';
import { tabChildStyle } from 'styles';

const days30 = 30 * 1000 * 60 * 60 * 24;

const countDownButtonStyle: React.CSSProperties = {
  ...tabChildStyle,
  display: 'flex',
  alignItems: 'center',
};

interface WithUpgrade {
  upgrade: ButtonProps['onClick'];
}

interface WithBecomeAProp {
  becomeAPro: React.ReactElement;
}

const ProMembershipButton: React.FC<
  { order: Order } & WithBecomeAProp & WithUpgrade
> = ({ order, upgrade, becomeAPro }) => {
  const minutesLeftOnMembership = React.useMemo(
    () => (days30 - (Date.now() - order.createdAt.toMillis())) / (1000 * 60),
    [order],
  );

  const hoursLeftOnMembership = minutesLeftOnMembership / 60;
  const daysLeftOnMembership = hoursLeftOnMembership / 24;
  const minutes = Math.round(minutesLeftOnMembership);
  const hours = Math.round(hoursLeftOnMembership);
  const days = Math.round(daysLeftOnMembership);

  return minutesLeftOnMembership > 0 ? (
    daysLeftOnMembership > 1 ? (
      <Tooltip title={`You're a pro for the next ${days} days.`}>
        <Box style={countDownButtonStyle}>
          {days} <Beenhere fontSize={'small'} color={'secondary'} />
        </Box>
      </Tooltip>
    ) : hoursLeftOnMembership > 0 ? (
      <Tooltip
        title={`You're a pro for the next ${hours} hours. To stay a prop, renew your membership.`}
      >
        <Box style={tabChildStyle} onClick={upgrade}>
          <EmojiEvents color={'secondary'} />
        </Box>
      </Tooltip>
    ) : minutesLeftOnMembership > 0 ? (
      <Tooltip
        title={`You're a pro for the next ${minutes} minutes. To stay a pro, renew your membership.`}
      >
        <Box style={tabChildStyle} onClick={upgrade}>
          <EmojiEvents color={'secondary'} />
        </Box>
      </Tooltip>
    ) : (
      becomeAPro
    )
  ) : (
    becomeAPro
  );
};

export const ProMembership: React.FC<
  Pick<User, 'uid'> & WithUpgrade & WithBecomeAProp
> = ({ uid, upgrade, becomeAPro }) => {
  const orderRef = useOrderRef(uid);
  const order = useFirestoreDoc<Order>(orderRef);

  if (order) {
    return (
      <ProMembershipButton
        order={order}
        upgrade={upgrade}
        becomeAPro={becomeAPro}
      />
    );
  } else {
    return becomeAPro;
  }
};
