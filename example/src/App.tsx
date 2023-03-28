import * as React from 'react';

import { StyleSheet, View, Button } from 'react-native';
import PayPal, {
  tokenQuickStart,
} from '@wutiange/react-native-paypal-checkout';

export default function App() {
  React.useEffect(() => {
    PayPal.config({
      clientId:
        'AXRqEAs6zVzF7u5Pd9ldBtZwL8VSYogHqBeXvzLdmcVFm5yPZzjIyRC7gQwTVxglLxk1t-TEVzBFw8Z3',
      secret:
        'EO4fO8gAeI21UZkITvK-ideME_kqgRAHazmOa_nctbBrlLotqXAIiRagtEKf1KoHVeOCPsjOJCKW1Q0E',
      environment: 'SANDBOX',
    });
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
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title="testPay"
        onPress={async () => {
          tokenQuickStart
            .startPaypalCheckout()
            .then((res: any) => {
              console.log('res', res, res.status);
            })
            .catch((err: any) => {
              console.log('err', err);
            });
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
