import { Menu, MenuItem, MenuProps } from '@material-ui/core';
import { IdeaModel, SetCheck } from 'models';
import React from 'react';
import { useValueWithFallback } from 'services';
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
    const openWithFallback = useValueWithFallback(open, { timeoutMs: 500 });

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
