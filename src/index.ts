import { PayPal } from './PayPal';
import { orderApi } from './orderApi/OrderApi';

export { tokenQuickStart } from './token/TokenQuickStart';

export type {
  OrderEntity,
  ApplicationContext,
  PurchaseUnits,
  UserAction,
  UnitAmount,
  CurrencyCode,
  Environment,
} from '@/types/OrderEntity';

export type { PayPalConfig } from '@/types/PaypalConfig';

export type {
  OrderDao,
  OrderPaymentSource,
  OrderPayer,
  OrderPayerName,
  OrderPurchaseUnits,
  OrderPurchaseUnitsAmount,
  OrderLinks,
  OrderProcessingInstruction,
  OrderIntent,
  OrderStatus,
} from '@/types/OrderDao';

const Paypal = {
  config: PayPal.config,
  clearCache: orderApi.clearCache,
};
export default Paypal;
