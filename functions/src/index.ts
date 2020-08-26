import * as admin from 'firebase-admin';
import { adjustIdeaCount } from './adjustIdeaCount';
import { adjustIdeaRating } from './adjustIdeaRating';
import { upgradeToPro } from './upgradeToPro';

admin.initializeApp();

export { adjustIdeaCount, adjustIdeaRating, upgradeToPro };
