import * as admin from 'firebase-admin';
import { adjustIdeaRating } from './adjustIdeaRating';
import { adjustIdeasAggregate } from './adjustIdeasAggregate';
import { getSitemap } from './getSitemap';
import { upgradeToPro } from './upgradeToPro';

admin.initializeApp();

export { adjustIdeasAggregate, adjustIdeaRating, upgradeToPro, getSitemap };
