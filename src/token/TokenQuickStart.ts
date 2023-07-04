import { Platform } from 'react-native';
import PaypalCheckout, { PaypalCheckoutEventEmitterInstance } from '../module';
import { PayPal } from '../PayPal';
import { orderApi } from '../orderApi/OrderApi';
import type { OrderDao, OrderEntity } from '../';
import { getAuthorization } from '../utils';

class TokenQuickStart {
  private static instance: TokenQuickStart | null = null;
  private promise: { resolve: any; reject: any } = {
    resolve: null,
    reject: null,
  };

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
    console.log('TokenQuickStart---------getInstance----');
    if (!this.instance) {
      this.instance = new TokenQuickStart();
    }
    return this.instance;
  }

  private async getPaypalToken() {
    PayPal.checkBaseUrl();
    const authorization = getAuthorization(PayPal.getAccountType());
    return orderApi.oauth2Token(authorization);
  }

  async createPaypalOrder(
    paypalBody: OrderEntity,
    headers?: Record<string, string>
  ) {
    PayPal.checkBaseUrl();
    // 获取 token ，这里每次都拿新的 token
    const token = await this.getPaypalToken();
    // 组装 body
    const body = JSON.stringify({
      intent: paypalBody.intent,
      application_context: paypalBody.application_context,
      purchase_units: paypalBody.purchase_units,
    });
    return orderApi.createOrder(token, body, headers);
  }

  private initiateNativePayment(orderDetail: OrderDao, token: string) {
    const tempLinks = orderDetail?.links ?? [];
    // 从 orderResponse.links 中获取相关链接
    let orderCaptureUrl: string | null = null;
    let orderAuthorizeUrl: string | null = null;
    let orderPatchUrl: string | null = null;
    const id = orderDetail?.id ?? null;
    for (const link of tempLinks) {
      switch (link?.rel) {
        case 'capture':
          orderCaptureUrl = link.href ?? null;
          break;
        case 'authorize':
          orderAuthorizeUrl = link.href ?? null;
          break;
        case 'update':
          orderPatchUrl = link.href ?? null;
          break;
      }
    }
    if (Platform.OS === 'android') {
      this.addListener();
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
      return PaypalCheckout.startSetPayPalPay(id, approvalType);
    } else {
      throw Error('Platform is not supported');
    }
  }

  startPaypalCheckout(
    orderId: string,
    headers?: Record<string, string>
  ): Promise<{ orderId: string; status: string }> {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'android') {
        this.promise.resolve = resolve;
        this.promise.reject = reject;
      }
      // 获取 token ，这里每次都拿新的 token
      this.getPaypalToken()
        .then((token) => {
          return Promise.all([
            orderApi.queryOrder(token, orderId, headers),
            token,
          ]);
        })
        .then(([orderDetail, token]) => {
          return this.initiateNativePayment(orderDetail, token);
        })
        .catch(reject);
    });
  }
}

const tokenQuickStart = TokenQuickStart.getInstance();
export { tokenQuickStart };
