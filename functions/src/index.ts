import * as admin from 'firebase-admin';
import { adjustIdeaRating } from './adjustIdeaRating';
import { adjustIdeasAggregate } from './adjustIdeasAggregate';
import { upgradeToPro } from './upgradeToPro';

admin.initializeApp();

export { adjustIdeasAggregate, adjustIdeaRating, upgradeToPro };
