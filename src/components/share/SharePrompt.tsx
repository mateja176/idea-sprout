import Tooltip from '@material-ui/core/Tooltip';
import Info from '@material-ui/icons/Info';
import React from 'react';
import { IdeaModel } from '../../models/idea';

const promptStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};
const shareStyle: React.CSSProperties = { textDecoration: 'underline' };

export const SharePrompt: React.FC<
  Pick<IdeaModel, 'name'> & { sharedByCount?: number }
> = ({ name, sharedByCount = 2 }) => {
  return sharedByCount ? (
    <span style={promptStyle}>
      <span>
        Care to share?{' '}
        <span style={shareStyle}>
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
};
