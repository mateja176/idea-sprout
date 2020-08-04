import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { IdeaModel, SetCheck } from 'models';
import React from 'react';
import { useBooleanWithFallback } from 'services';
import { ExpectationsCheck } from './ExpectationsCheck';
import { NicheCheck } from './NicheCheck';

export const CheckMenu = React.memo(
  React.forwardRef<
    HTMLButtonElement | null,
    Pick<IdeaModel, 'checks'> &
      Pick<MenuProps, 'open' | 'onClose'> & {
        setCheck: SetCheck;
      }
  >(({ open, onClose, checks, setCheck }, ref) => {
    const openWithFallback = useBooleanWithFallback(open, { timeoutMs: 500 });

    return (
      <Menu
        anchorEl={
          (ref as React.MutableRefObject<HTMLButtonElement | null>).current
        }
        open={open}
        onClose={onClose}
      >
        {openWithFallback && [
          <MenuItem key={'niche'}>
            <NicheCheck checked={checks.niche} onChange={setCheck('niche')} />
          </MenuItem>,
          <MenuItem key={'expectations'}>
            <ExpectationsCheck
              checked={checks.expectations}
              onChange={setCheck('expectations')}
            />
          </MenuItem>,
        ]}
      </Menu>
    );
  }),
);
