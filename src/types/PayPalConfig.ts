import type { CurrencyCode, Environment, UserAction } from './PayPalBody';

export default interface PayPalConfig {
  clientId: string;
  secret?: string;
  environment: Environment;
  currencyCode?: CurrencyCode;
  userAction?: UserAction;
  loggingEnabled?: boolean;
  shouldFailEligibility?: boolean;
  stageUrl?: string;
  port?: string;
}
