export const feedbackHelperText = `What did you like or dislike about the idea? Your feedback directly shapes the course of the idea.`;
export const feedbackFieldRows = 5;
export const doNotShareWarning =
  'Share the idea to help it grow or just tick the above checkbox';

export const getReviewPrompt = (reviewCount: number) =>
  reviewCount > 1
    ? `Join the ${reviewCount} people who reviewed`
    : "Your review directly impacts the idea's lifecycle";
