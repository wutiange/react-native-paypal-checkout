import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-paypal-checkout' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const PaypalCheckout = NativeModules.ReactNativePaypalCheckout
  ? NativeModules.ReactNativePaypalCheckout
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

let eventEmitter: NativeEventEmitter | null = null;
export const PaypalCheckoutEventEmitterInstance = () => {
  if (eventEmitter === null) {
    eventEmitter = new NativeEventEmitter(PaypalCheckout);
  }
  return eventEmitter;
};

export default PaypalCheckout;
