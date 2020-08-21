import { proMembershipDiscount } from 'elements/upgrade';
import { Upgrade } from 'models/upgrade';
import { GlobalWithPaypal, Order } from 'types/paypal';
import { env } from './env';

export interface RenderButtonsParams {
  id: string;
  upgrade: Upgrade;
  onApprove: () => void;
  close: () => void;
}

export const renderButtons = ({
  id,
  upgrade,
  onApprove,
  close,
}: RenderButtonsParams) => () =>
  (globalThis as GlobalWithPaypal).paypal
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

        return capture()
          .then(({ id }) => upgrade({ orderId: id }))
          .then(close);
      },
    })
    .render(`#${id}`);

export const paypalScriptId = 'paypal-script';

export const loadPaypalScript = () => {
  const script = globalThis.document.createElement('script');
  script.src = `https://www.paypal.com/sdk/js?client-id=${env.paypalClientId}`;
  script.id = paypalScriptId;

  globalThis.document.body.appendChild(script);

  return new Promise((resolve) => {
    script.addEventListener('load', resolve);
  });
};

export const hasPaypalScriptLoaded = () =>
  !!globalThis.document.getElementById(paypalScriptId);
