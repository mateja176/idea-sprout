import firebase from 'firebase/app';
import 'firebase/firestore';

export const useIdea = () => {
  return firebase.firestore().collection('ideas').doc();
};
