import 'firebase/analytics';
import React from 'react';
import { useAnalytics as useFirebaseAnalytics } from 'reactfire';

export interface SigninEvent {
  name: 'signin';
  params: { from: string; uid: string };
}
export interface CreateIdeaEvent {
  name: 'createIdea';
  params: { id: string; uid: string };
}
export interface EditIdeaEvent {
  name: 'editIdea';
  params: {
    id: string;
    uid: string;
    type: 'edit' | 'publish' | 'unpublish';
  };
}
export interface PublishIdeaEvent {
  name: 'publishIdea';
  params: { id: string; uid: string };
}
export interface ShareIdeaEvent {
  name: 'shareIdea';
  params: {
    provider: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'viber';
    uid: string;
  };
}
export interface ReviewIdeaEvent {
  name: 'reviewIdea';
  params: { uid: string };
}

export type AnalyticsEvent =
  | SigninEvent
  | CreateIdeaEvent
  | EditIdeaEvent
  | PublishIdeaEvent
  | ShareIdeaEvent
  | ReviewIdeaEvent;

export const useAnalytics = () => {
  const analytics = useFirebaseAnalytics();

  return React.useMemo(
    () => ({
      log: ({ name, params }: AnalyticsEvent) =>
        analytics.logEvent(name, params),
    }),
    [analytics],
  );
};
