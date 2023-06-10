import { Platform } from 'react-native';
import PaypalCheckout, { PaypalCheckoutEventEmitterInstance } from '../module';
import PayPal from '../PayPal';
import type { OrderResponse } from '../types/OrderResponse';
import type PayPalBody from '../types/PayPalBody';
import { Buffer } from 'buffer';

export default class TokenQuickStart {
  private static instance: TokenQuickStart | null = null;
  private token: string | null = null;
  private orderResponse: OrderResponse | null = null;
  private promise: { resolve: any; reject: any } = {
    resolve: null,
    reject: null,
  };

  // 检查 token 是否已经设置，没有设置则抛出错误
  private checkTokenAndReturn() {
    if (!this.token) {
      throw new Error('token is not set');
    }
    return this.token;
  }

  private addListener() {
    if (Platform.OS === 'android') {
      PaypalCheckoutEventEmitterInstance().addListener(
        'ReactNativePaypalCheckout_Event',
        (data: any) => {
          if (data.code === 0) {
            this.promise.resolve?.(JSON.parse(data.message));
            this.promise.resolve = null;
          } else {
            this.promise.reject?.(data.message);
            this.promise.resolve = null;
          }
          this.removeListener();
        }
      );
    }
  }

  private removeListener() {
    if (Platform.OS === 'android') {
      PaypalCheckoutEventEmitterInstance().removeAllListeners(
        'ReactNativePaypalCheckout_Event'
      );
    }
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new TokenQuickStart();
    }
    return this.instance;
  }

  private getAuthorization() {
    // 得到 client_id 和 client_secret
    const { clientId, secret } = PayPal.getClientIdAndSecret();
    const usernameAndPassword = `${clientId}:${secret}`;
    const encoded = this.encodeAndBase64(usernameAndPassword, 'latin1');
    return `Basic ${encoded}`;
  }

  // 对字符串进行 encode 和 base64，需要指定编码方式
  private encodeAndBase64(str: string, encoding: BufferEncoding) {
    return Buffer.from(str, encoding).toString('base64');
  }

  private async getPaypalToken() {
    PayPal.checkBaseUrl();
    const Authorization = this.getAuthorization();
    this.token = await fetch(
      `${PayPal.baseUrl}/v1/oauth2/token?grant_type=client_credentials`,
      {
        method: 'POST',
        headers: {
          Authorization,
        },
      }
    )
      .then((res) => res.json())
      .then((text) => text.access_token);
  }

  async getOrderResponse(paypalBody: PayPalBody) {
    PayPal.checkBaseUrl();
    // 获取 token ，这里每次都拿新的 token
    await this.getPaypalToken();
    // 检查 token 是否成功拿取
    const token = this.checkTokenAndReturn();
    // 组装 body
    const body = JSON.stringify({
      intent: paypalBody.intent,
      application_context: paypalBody.application_context,
      purchase_units: paypalBody.purchase_units,
    });
    this.orderResponse = await fetch(`${PayPal.baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body,
    }).then((res) => res.json());
    return this.orderResponse;
  }

  startPaypalCheckout() {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'android') {
        this.promise.resolve = resolve;
        this.promise.reject = reject;
      }
      // 获取 TokenQuickStart 实例
      const tokenInstance = TokenQuickStart.getInstance();
      // 检查 token 是否成功拿取
      const token = tokenInstance.checkTokenAndReturn();
      const orderCaptureUrl =
        tokenInstance.orderResponse?.links.find(
          (link) => link.rel === 'capture'
        )?.href ?? null;
      const orderAuthorizeUrl =
        tokenInstance.orderResponse?.links.find(
          (link) => link.rel === 'authorize'
        )?.href ?? null;
      const orderPatchUrl =
        tokenInstance.orderResponse?.links.find((link) => link.rel === 'update')
          ?.href ?? null;
      const id = tokenInstance.orderResponse?.id ?? null;
      this.addListener();
      if (Platform.OS === 'android') {
        PaypalCheckout.startSetPayPalPay(
          id,
          orderCaptureUrl,
          orderAuthorizeUrl,
          orderPatchUrl,
          token
        );
      } else if (Platform.OS === 'ios') {
        let approvalType = '';
        if (orderCaptureUrl) {
          approvalType = 'capture';
        } else if (orderAuthorizeUrl) {
          approvalType = 'authorize';
        }
        PaypalCheckout.startSetPayPalPay(id, approvalType)
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error('Platform is not supported'));
      }
    });
  }
}
