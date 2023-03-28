export default interface PayPalBody {
  application_context: ApplicationContext;
  intent: OrderIntent;
  purchase_units: PurchaseUnits[];
}

export interface ApplicationContext {
  user_action: UserAction;
}

export type OrderIntent = 'AUTHORIZE' | 'CAPTURE';

export interface PurchaseUnits {
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

export type UserAction = 'PAY_NOW' | 'CONTINUE';

export interface UnitAmount {
  currency_code: CurrencyCode;
  value: string;
}

export type CurrencyCode =
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

export type Environment = 'SANDBOX' | 'LIVE' | 'STAGE' | 'LOCAL' | string;
