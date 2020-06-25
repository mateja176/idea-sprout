import { IdeaModel } from 'models';
import { useFirestore } from 'reactfire';

export const useIdeasRef = () => {
  return useFirestore().collection('ideas');
};

export const useReviewsRef = ({ id }: Pick<IdeaModel, 'id'>) => {
  const ideas = useIdeasRef();

  return ideas.doc(id).collection('reviews');
};

export const useUsersRef = () => {
  return useFirestore().collection('users');
};
