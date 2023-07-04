import PaypalCheckout from './module';
import type PayPalConfig from './types/PayPalConfig';
import { envStrToUrl } from './utils';

class PayPal {
  static baseUrl: string | null = null;
  private static clientId?: string;

  static setClientId(clientId: string) {
    this.clientId = clientId;
  }

  static setBaseUrl(url: string) {
    PayPal.baseUrl = url;
  }

  static checkBaseUrl() {
    if (!PayPal.baseUrl) {
      throw new Error('baseUrl is not set');
    }
  }

  static getClientId() {
    if (!this.clientId) {
      throw new Error('clientId is not set');
    }
    return this.clientId;
  }

  static config(cfg: PayPalConfig) {
    cfg.loggingEnabled = cfg.loggingEnabled ?? false;
    cfg.shouldFailEligibility = cfg.shouldFailEligibility ?? false;
    this.setClientId(cfg.clientId);
    PayPal.setBaseUrl(envStrToUrl(cfg.environment));
    PaypalCheckout.config(cfg);
  }
}

export { PayPal };
