export const ideaStatuses = [
  'draft',
  'readyForPublishing',
  'published',
  'grown',
  'discarded',
  'unpublished',
] as const;
export type IdeaStatuses = typeof ideaStatuses;
export type IdeaStatus = IdeaStatuses[number];

export interface Idea {
  id: string;
  rating: number;
  /**
   * the checks are a way of guiding creators towards publishing high quality ideas
   */
  checks: {
    niche: boolean;
    expectations: boolean;
  };
  status: IdeaStatus;
  name: string;
  /**
   * video which may be up to 5 minutes in length
   */
  storyURL: string;
  problemSolution: string;
  imageURLs: string[];
  rationale: string;
}

export type CreationIdea = Omit<Idea, 'id' | 'rating' | 'status' | 'checks'> &
  Idea['checks'];
