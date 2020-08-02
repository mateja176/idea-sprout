import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import * as url from 'url';
import { interfaces, paypal } from './interfaces';

admin.initializeApp();

export const adjustIdeaCount = functions.firestore
  .document('ideas/{ideaId}')
  .onUpdate(async (handler) => {
    const data = handler.after.data();
    const ideasCountRef = admin.firestore().doc('counts/ideas');
    if (data && 'status' in data) {
      if (data.status === 'sprout') {
        return ideasCountRef.update({
          count: admin.firestore.FieldValue.increment(1),
        });
      } else if (data.status === 'seed') {
        return ideasCountRef.update({
          count: admin.firestore.FieldValue.increment(-1),
        });
      } else {
        return null;
      }
    } else {
      return null;
    }
  });

export const upgradeToPro = functions.https.onCall(async (data, context) => {
  const { orderId } = data;

  if (!(typeof orderId === 'string') || orderId.length === 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with an "orderId" argument, representing the id or the placed order.',
    );
  }

  const uid = context.auth?.uid;

  if (!uid) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'No existent user id.',
    );
  }

  const ordersRef = admin.firestore().collection('orders');

  const order = await ordersRef.doc(orderId).get();

  if (order.exists) {
    throw new functions.https.HttpsError(
      'already-exists',
      'The order already exists',
    );
  }

  // * verify order

  const config = functions.config() as interfaces.Config;

  // 1c. Get an access token from the PayPal API
  const basicAuth = Buffer.from(
    `${config.paypal.client}:${config.paypal.secret}`,
  ).toString('base64');

  const auth: paypal.Auth = await fetch(config.paypal.oauth_api, {
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${basicAuth}`,
    },
    method: 'POST',
    body: new url.URLSearchParams({
      grant_type: 'client_credentials',
    }),
  }).then((res) => res.json());

  // 3. Call PayPal to get the transaction details
  const details: paypal.OrderDetails = await fetch(
    config.paypal.order_api + orderId,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${auth.access_token}`,
      },
    },
  ).then((res) => res.json());

  // 5. Validate the transaction details are as expected
  const amount = details.purchase_units[0].amount.value;
  if (Number(amount) < Number(config.paypal.amount)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      `The amount your specified "${amount}" does not match the required "${config.paypal.amount}"`,
    );
  }

  // * upgrade

  const user = await admin.auth().getUser(uid);

  if (!user.customClaims?.isPro) {
    await admin.auth().setCustomUserClaims(uid, {
      isPro: true,
    });
  }

  const orderRef = ordersRef.doc(orderId);

  await orderRef.set({
    userId: uid,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});
