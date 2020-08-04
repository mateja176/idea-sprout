import Skeleton from '@material-ui/lab/Skeleton';
import { IdeaPreviewWrapper } from 'components';
import React from 'react';
import { IdeaImagePreview } from './IdeaImagePreview';

export const IdeaImagePreviewSuspender: React.FC<React.ComponentProps<
  typeof IdeaImagePreview
>> = (props) => (
  <React.Suspense
    fallback={
      <IdeaPreviewWrapper>
        <Skeleton variant={'rect'} width={'100%'} height={'100%'} />
      </IdeaPreviewWrapper>
    }
  >
    <IdeaImagePreview {...props} />
  </React.Suspense>
);