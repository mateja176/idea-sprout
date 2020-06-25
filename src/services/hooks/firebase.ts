import { IdeaModel } from 'models';
import { useFirestore } from 'reactfire';

export const useIdeasRef = () => {
  return useFirestore().collection('ideas');
};

export const useReviewsRef = ({ id }: Pick<IdeaModel, 'id'>) => {
  const ideasRef = useIdeasRef();

  return ideasRef.doc(id).collection('reviews');
};
