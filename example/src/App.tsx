import * as React from 'react';

import { StyleSheet, View, Button, TextInput } from 'react-native';
import Paypal, {
  tokenQuickStart,
} from '@wutiange/react-native-paypal-checkout';

export default function App() {
  const orderIdRef = React.useRef<string>('');
  return (
    <View style={styles.container}>
      <Button
        title="开始支付"
        onPress={async () => {
          try {
            console.log('Paypal-----------', Paypal);
            Paypal.config({
              accountType: 'xiao',
              environment: 'SANDBOX',
            });
            console.log('------tokenQuickStart-------', tokenQuickStart);
            console.log(
              'tokenQuickStart--------createPaypalOrder---',
              tokenQuickStart.createPaypalOrder
            );
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
            console.log(
              'tokenQuickStart--------startPaypalCheckout---',
              tokenQuickStart.startPaypalCheckout
            );
            const payResult = await tokenQuickStart.startPaypalCheckout(
              orderDetail.id
            );
            console.log('payResult-----------', payResult);
          } catch (error) {
            console.warn('error-------11111----', error);
          }
        }}
      />
      <Button
        title="清空缓存"
        onPress={() => {
          Paypal.clearCache();
        }}
      />

      <TextInput
        placeholder="输入订单id"
        onChangeText={(text) => {
          orderIdRef.current = text;
        }}
      />
      <Button
        title="测试已存在的订单或取消的订单"
        onPress={async () => {
          try {
            Paypal.config({
              accountType: 'xiao',
              environment: 'SANDBOX',
            });
            const payResult = await tokenQuickStart.startPaypalCheckout(
              orderIdRef.current
            );
            console.log('payResult-----------', payResult);
          } catch (error) {
            console.warn('error-------22222----', error);
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
