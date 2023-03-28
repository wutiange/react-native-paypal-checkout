import PaypalCheckout from './module';
import type PayPalConfig from './types/PayPalConfig';
import { envStrToUrl } from './utils';

export default class PayPal {
  static baseUrl: string | null = null;
  private static clientId?: string;
  private static secret?: string;

  static setClientIdAndSecret(clientId: string, secret: string) {
    this.clientId = clientId;
    this.secret = secret;
  }

  static setBaseUrl(url: string) {
    PayPal.baseUrl = url;
  }

  static checkBaseUrl() {
    if (!PayPal.baseUrl) {
      throw new Error('baseUrl is not set');
    }
  }

  static getClientIdAndSecret() {
    if (!this.clientId || !this.secret) {
      throw new Error('clientId or secret is not set');
    }
    return {
      clientId: this.clientId,
      secret: this.secret,
    };
  }

  static config(cfg: PayPalConfig) {
    cfg.loggingEnabled = cfg.loggingEnabled || false;
    cfg.shouldFailEligibility = cfg.shouldFailEligibility || false;
    this.setClientIdAndSecret(cfg.clientId, cfg.secret || '');
    PayPal.setBaseUrl(envStrToUrl(cfg.environment));
    PaypalCheckout.config(cfg);
  }
}
