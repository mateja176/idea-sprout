import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';
import { IdeaPreviewWrapper } from '../../../components/Idea/IdeaPreviewWrapper';
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
