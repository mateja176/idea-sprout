import { makeStyles } from '@material-ui/core';
import { IdeaOptions } from 'containers';
import { User } from 'firebase/app';
import 'firebase/firestore';
import { IdeaModel } from 'models';
import React from 'react';
import { useIdeaOptionButtonStyle, useIdeaUrl } from 'services';
import { ExportReviewSuspender } from './Review';

export interface IdeaRowProps {
  idea: IdeaModel;
  user: User;
}

const useStyles = makeStyles(() => ({
  root: {
    minWidth: 0,
    width: '100%',
    height: '100%',
    opacity: 1,
  },
  wrapper: {
    height: '100%',
  },
}));

export const IdeaRow = React.memo(
  React.forwardRef<HTMLDivElement, IdeaRowProps>(({ idea, user }, ref) => {
    const ideaUrl = useIdeaUrl(idea.id);

    const classes = useStyles();

    const buttonStyle = useIdeaOptionButtonStyle();

    const exportReviewStyle: React.CSSProperties = React.useMemo(
      () => ({
        ...buttonStyle,
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }),
      [buttonStyle],
    );

    return (
      <div ref={ref} key={idea.id}>
        <IdeaOptions
          uid={user.uid}
          idea={idea}
          ideaUrl={ideaUrl}
          navigationButton={
            <ExportReviewSuspender
              style={exportReviewStyle}
              classes={classes}
              idea={idea}
              user={user}
            />
          }
        />
      </div>
    );
  }),
);
