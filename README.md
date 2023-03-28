# @wutiange/react-native-paypal-checkout

paypal checkout sdk

## Installation

```sh
npm install @wutiange/react-native-paypal-checkout
```

## Usage

```js
import PayPal, { tokenQuickStart } from '@wutiange/react-native-paypal-checkout';

// ...
// 先配置
PayPal.config({
  clientId:
    '你的 clientId',
  secret:
    '你的 secret',
  environment: 'SANDBOX',
});
// 再获取订单 id
tokenQuickStart.getOrderResponse({
  application_context: {
    user_action: 'PAY_NOW',
  },
  intent: 'CAPTURE',
  purchase_units: [
    {
      amount: {
        currency_code: 'USD',
        value: '0.5',
      },
    },
  ],
});
// 再发起支付
tokenQuickStart
  .startPaypalCheckout()
  .then((res: any) => {
    console.log('res', res, res.status);
  })
  .catch((err: any) => {
    console.log('err', err);
  });
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
