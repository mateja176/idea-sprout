import { makeStyles } from '@material-ui/core';
import { IdeaOptions } from 'containers';
import 'firebase/firestore';
import { IdeaModel, User } from 'models';
import React from 'react';
import { useIdeaUrl } from 'services';
import { ExportReviewSuspender } from './Review';

export interface IdeaRowProps extends Pick<User, 'uid' | 'email'> {
  idea: IdeaModel;
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
  React.forwardRef<HTMLDivElement, IdeaRowProps>(
    ({ idea, uid, email }, ref) => {
      const ideaUrl = useIdeaUrl(idea.id);

      const classes = useStyles();

      const NavigationButton = React.useCallback(
        ({
          style,
        }: Pick<
          React.ComponentProps<typeof ExportReviewSuspender>,
          'style'
        >) => (
          <ExportReviewSuspender
            style={{
              ...style,
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            classes={classes}
            idea={idea}
            uid={uid}
            email={email}
          />
        ),
        [idea, uid, email, classes],
      );

      return (
        <div ref={ref} key={idea.id}>
          <IdeaOptions
            uid={uid}
            idea={idea}
            ideaUrl={ideaUrl}
            NavigationButton={NavigationButton}
          />
        </div>
      );
    },
  ),
);
