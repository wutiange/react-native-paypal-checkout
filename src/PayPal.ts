import type { PayPalConfig } from '.';
import PaypalCheckout from './module';
import { envStrToUrl } from './utils';
import data from './data.json';

class PayPal {
  static baseUrl: string | null = null;
  private static accountType?: string;

  static setBaseUrl(url: string) {
    PayPal.baseUrl = url;
  }

  static checkBaseUrl() {
    if (!PayPal.baseUrl) {
      throw new Error('baseUrl is not set');
    }
  }

  static getAccountType() {
    if (!PayPal.accountType) {
      throw new Error('accountType is not set');
    }
    return PayPal.accountType;
  }

  static config(cfg: PayPalConfig) {
    cfg.clientId = (data as Record<string, string>)[
      `${cfg.accountType}$$clientId`
    ];
    if (!cfg.clientId) {
      throw new Error('clientId is not set');
    }
    cfg.loggingEnabled = cfg.loggingEnabled ?? false;
    cfg.shouldFailEligibility = cfg.shouldFailEligibility ?? false;
    PayPal.accountType = cfg.accountType;
    PayPal.setBaseUrl(envStrToUrl(cfg.environment));
    PaypalCheckout.config(cfg);
  }
}

export { PayPal };
