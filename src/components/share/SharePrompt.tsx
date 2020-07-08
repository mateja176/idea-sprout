import { Tooltip } from '@material-ui/core';
import { Info } from '@material-ui/icons';
import { IdeaModel } from 'models';
import React from 'react';

export const SharePrompt: React.FC<
  Pick<IdeaModel, 'name'> & { sharedByCount?: number }
> = ({ name, sharedByCount = 2 }) =>
  sharedByCount ? (
    <span style={{ display: 'flex', alignItems: 'center' }}>
      <span>
        Care to share?{' '}
        <span style={{ textDecoration: 'underline' }}>
          {sharedByCount} {sharedByCount > 1 ? `people` : 'person'}
        </span>{' '}
        shared <i>{name}</i>.
      </span>
      &nbsp;
      <Tooltip placement="top" title="The share count is unique per person">
        <Info color="action" />
      </Tooltip>
    </span>
  ) : (
    <span>
      Be the first one to share <i>{name}</i>.
    </span>
  );
