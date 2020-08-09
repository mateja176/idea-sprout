import makeStyles from '@material-ui/core/styles/makeStyles';
import { User } from 'firebase/app';
import { IdeaModel } from 'models/idea';
import React from 'react';
import { useIdeaUrl } from 'services/hooks/idea';
import { useIdeaOptionButtonStyle } from 'services/hooks/style';
import { IdeaOptions } from './Options/IdeaOptions';
import { ExportReviewSuspender } from './Review/Export';

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
