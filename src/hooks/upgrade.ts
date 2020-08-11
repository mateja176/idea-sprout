import { proMembershipDiscount } from 'elements/upgrade';
import firebase from 'firebase/app';
import { Provider, ProviderId, User } from 'models/auth';
import { Upgrade } from 'models/upgrade';
import React from 'react';
import { Order } from 'types/paypal';

export const useRenderButtons = ({
  id,
  upgrade,
  onApprove,
  user,
  reauthenticateWithPassword,
  reauthenticateWithPopup,
  close,
}: {
  id: string;
  upgrade: Upgrade;
  onApprove: () => void;
  user: User;
  reauthenticateWithPassword: () => void;
  reauthenticateWithPopup: (
    provider: Provider,
  ) => Promise<firebase.auth.UserCredential>;
  close: () => void;
}) => {
  return React.useCallback(
    () =>
      window.paypal
        ?.Buttons({
          createOrder: (_, actions) =>
            actions.order.create({
              purchase_units: [
                {
                  description: 'Pro membership',
                  amount: {
                    value: proMembershipDiscount.amount.value,
                  },
                },
              ],
            }),
          onApprove: (_, actions) => {
            onApprove();

            const capture = () =>
              actions.order.capture().catch(
                () =>
                  new Promise<Order>((resolve) => {
                    setTimeout(() => {
                      capture().then(resolve);
                    }, 2000);
                  }),
              );

            return capture().then(({ id }) =>
              upgrade({ orderId: id }).then(() => {
                const [provider] = user.providerData;
                if (provider) {
                  const providerId = provider.providerId as ProviderId;
                  if (providerId === 'password') {
                    reauthenticateWithPassword();
                  } else {
                    const CurrentProvider = [
                      firebase.auth.GoogleAuthProvider,
                      firebase.auth.FacebookAuthProvider,
                      firebase.auth.TwitterAuthProvider,
                    ].find((provider) => provider.PROVIDER_ID === providerId);
                    if (CurrentProvider) {
                      return reauthenticateWithPopup(CurrentProvider).then(
                        close,
                      );
                    } else {
                      console.error('Unknown provider id', providerId);
                    }
                  }
                } else {
                  console.error('No provider found for user', user);
                }
              }),
            );
          },
        })
        .render(`#${id}`),
    [
      id,
      onApprove,
      upgrade,
      user,
      reauthenticateWithPassword,
      reauthenticateWithPopup,
      close,
    ],
  );
};
