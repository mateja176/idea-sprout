import { IdeaModel, User } from 'models';
import { useFirestore, useUser } from 'reactfire';

export const useIdeas = () => {
  return useFirestore().collection('ideas');
};

export const useReviews = ({ id }: Pick<IdeaModel, 'id'>) => {
  const ideas = useIdeas();

  return ideas.doc(id).collection('reviews');
};

export const useUsers = () => {
  return useFirestore().collection('users');
};

export const useSubscriptions = () => {
  const users = useUsers();

  const id = useUser<User>().uid;

  return users.doc(id).collection('subscriptions');
};
