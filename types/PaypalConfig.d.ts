import type { CurrencyCode, Environment, UserAction } from './OrderEntity';

interface PayPalConfig {
  clientId?: string;
  accountType: string;
  environment: Environment;
  currencyCode?: CurrencyCode;
  userAction?: UserAction;
  loggingEnabled?: boolean;
  shouldFailEligibility?: boolean;
  stageUrl?: string;
  port?: string;
}

export { PayPalConfig };
