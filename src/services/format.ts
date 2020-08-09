import { currency } from 'models/upgrade';

export const formatCurrency: ReturnType<
  typeof Intl['NumberFormat']
>['format'] = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
