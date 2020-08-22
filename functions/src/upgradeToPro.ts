import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import * as url from 'url';
import * as models from './models/models';
import * as paypal from './types/paypal';

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

  const config = functions.config() as models.Config;

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
  if (
    1000 * 60 * 60 * 60 * 24 * 30 -
      (Date.now() - new Date(details.create_time).getTime()) <=
    0
  ) {
    throw new functions.https.HttpsError(
      'deadline-exceeded',
      'The order expired',
    );
  }

  // * upgrade

  const orderRef = ordersRef.doc(uid);

  await orderRef.set({
    orderId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});
