import type { OrderIntent } from './OrderDao';

interface OrderEntity {
  application_context: ApplicationContext;
  intent: OrderIntent;
  purchase_units: PurchaseUnits[];
}

interface ApplicationContext {
  user_action: UserAction;
}

interface PurchaseUnits {
  reference_id?: string;
  invoice_id?: string;
  custom_id?: string;
  soft_descriptor?: string;
  shipping?: string;
  items?: string;
  payments?: string;
  payee?: string;
  amount?: UnitAmount;
}

type UserAction = 'PAY_NOW' | 'CONTINUE';

interface UnitAmount {
  currency_code: CurrencyCode;
  value: string;
}

type CurrencyCode =
  | 'AUD'
  | 'BRL'
  | 'CAD'
  | 'CNY'
  | 'CZK'
  | 'DKK'
  | 'EUR'
  | 'HKD'
  | 'HUF'
  | 'INR'
  | 'ILS'
  | 'JPY'
  | 'MYR'
  | 'MXN'
  | 'TWD'
  | 'NZD'
  | 'NOK'
  | 'PHP'
  | 'PLN'
  | 'GBP'
  | 'RUB'
  | 'SGD'
  | 'SEK'
  | 'CHF'
  | 'THB'
  | 'USD';

type Environment = 'SANDBOX' | 'LIVE' | 'STAGE' | 'LOCAL' | string;

export {
  OrderEntity,
  ApplicationContext,
  PurchaseUnits,
  UserAction,
  UnitAmount,
  CurrencyCode,
  Environment,
};
