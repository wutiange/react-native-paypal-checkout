import type { OrderDao } from '../';
import { PayPal } from '../PayPal';

class OrderApi {
  // 过期时间为 1 day
  private expiration = 24 * 60 * 60 * 1000;

  // cacheRequest 用于缓存请求，避免重复请求，
  // 类型说明：key 代表请求的唯一变量，value 为一个数组，第一个元素为请求的结果，第二个元素为过期时间
  private cacheRequest: Record<string, [any, number]> = {};

  // 检查请求是否已经过期
  private checkExpired(key: string) {
    const [_, expiration] = this.cacheRequest[key] ?? [];
    return !(expiration && expiration >= Date.now());
  }

  async oauth2Token(
    authorization: string,
    headers?: Record<string, string>
  ): Promise<string> {
    const key = `oauth2/token/${authorization}`;
    if (!this.checkExpired(key)) {
      return this.cacheRequest[key]?.[0] ?? '';
    }
    const response = await fetch(
      `${PayPal.baseUrl}/v1/oauth2/token?grant_type=client_credentials`,
      {
        method: 'POST',
        headers: {
          Authorization: authorization,
          ...headers,
        },
      }
    )
      .then((res) => res.json())
      .then((text) => text.access_token);
    this.cacheRequest[key] = [response, Date.now() + this.expiration];
    return response;
  }

  /**
   * 创建 paypal 订单
   * @param token 请求所需要的 token
   * @param body 订单相关的信息，包括价格，货币类型等等
   * @param headers 其他 header 参数
   * @returns 所创建订单的信息
   */
  async createOrder(
    token: string,
    body: string,
    headers?: Record<string, string>
  ): Promise<OrderDao> {
    const key = `${body}/${token}`;
    if (!this.checkExpired(key)) {
      return this.cacheRequest[key]?.[0] ?? '';
    }
    const response = await fetch(`${PayPal.baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...headers,
      },
      body,
    }).then((res) => res.json());
    this.cacheRequest[key] = [response, Date.now() + this.expiration];
    return response;
  }

  /**
   * 查询已经存在的 paypal 订单详情
   * @param token 请求所需要的 token
   * @param orderId 已经创建的订单 id
   * @param headers 其他参数
   * @returns 所查询订单的信息
   */
  async queryOrder(
    token: string,
    orderId: string,
    headers?: Record<string, string>
  ): Promise<OrderDao> {
    const key = `${orderId}/${token}`;
    if (!this.checkExpired(key)) {
      return this.cacheRequest[key]?.[0] ?? '';
    }
    const response: OrderDao = await fetch(
      `${PayPal.baseUrl}/v2/checkout/orders/${orderId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...headers,
        },
      }
    ).then((res) => res.json());
    if (!(response.status && response.id) && response.message) {
      throw new Error(response.message);
    }
    console.log('queryOrder-----=======', response);
    this.cacheRequest[key] = [response, Date.now() + this.expiration];
    return response;
  }

  clearCache() {
    this.cacheRequest = {};
  }
}

const orderApi = new OrderApi();
export { orderApi };
