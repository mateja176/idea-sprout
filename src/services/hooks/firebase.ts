import { useFirestore } from 'reactfire';

export const useIdeas = () => {
  return useFirestore().collection('ideas');
};
