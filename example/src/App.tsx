import * as React from 'react';

import { StyleSheet, View, Button } from 'react-native';
import Paypal, {
  tokenQuickStart,
} from '@wutiange/react-native-paypal-checkout';

export default function App() {
  return (
    <View style={styles.container}>
      <Button
        title="开始支付"
        onPress={async () => {
          try {
            Paypal.config({
              clientId:
                'AXRqEAs6zVzF7u5Pd9ldBtZwL8VSYogHqBeXvzLdmcVFm5yPZzjIyRC7gQwTVxglLxk1t-TEVzBFw8Z3',
              environment: 'SANDBOX',
            });
            const orderDetail = await tokenQuickStart.createPaypalOrder({
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
            const payResult = await tokenQuickStart.startPaypalCheckout(
              orderDetail.id
            );
            console.log('payResult-----------', payResult);
          } catch (error) {
            console.warn('error-----------', error);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
