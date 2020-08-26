import * as admin from 'firebase-admin';
import { adjustIdeaRating } from './adjustIdeaRating';
import { adjustIdeasAggregate } from './adjustIdeasAggregate';
import { sitemap } from './sitemap';
import { upgradeToPro } from './upgradeToPro';

admin.initializeApp();

export { adjustIdeasAggregate, adjustIdeaRating, upgradeToPro, sitemap };
