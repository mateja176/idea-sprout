import { proMembershipDiscount } from 'elements/upgrade';
import { Upgrade } from 'models/upgrade';
import { Order } from 'types/paypal';

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

        return capture()
          .then(({ id }) => upgrade({ orderId: id }))
          .then(close);
      },
    })
    .render(`#${id}`);
