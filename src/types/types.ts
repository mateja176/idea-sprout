import { Drift } from './drift';
import { _reactFirePreloadedObservables } from './firebase';
import { Paypal } from './paypal';
import { YT } from './youtube';

declare global {
  interface Window {
    paypal?: Paypal;
    drift?: Drift;
    _reactFirePreloadedObservables?: _reactFirePreloadedObservables;
    YT?: YT;
  }
}
