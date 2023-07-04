# @wutiange/react-native-paypal-checkout

paypal checkout sdk

**注意：我这里只说自动 link 的方式，如果你需要手动配置，除了我下面的要配置外，其他的跟其他库是相同的。**

在操作之前请先去 paypal 官网注册账号，对于调试来说随便一个账号就行，因为不是真的支付；如果要真的支付是需要 paypal 认证的。

接下来我就说测试情况下怎么操作，也就是 sandbox 环境

1. 首先进入 paypal developer dashboard, 地址为： [PayPal Developer](https://developer.paypal.com/home) ；
2. 然后点击 Log in to Dashboard ，如果没有注册记得先注册；
3. 在 tab 标签中选择 `App & Credentials` ，网址： [Applications](https://developer.paypal.com/dashboard/applications/sandbox) ；
4. 如果没有应用，新建应用，除了 App Name 外，其他的默认， **如果你们业务不同，请按照你们的业务进行选择，我这里只是介绍能正常测试通过的方式**。
5. 新建成功以后就可以看到 `Client ID` 了，复制下来， `Client ID` 的下面就是 `Secret` ，点击 Show 即可查看，也复制下来；
6. 滑到下面有一个 `Log in with PayPal` ， 勾选这个，然后点击 `Advance Options` 展开配置项，按需配置即可，然后保存；
7. 还有一项是 `Return URL` 这个在 `Log in with PayPal` 的上面，点击 `Show` ，把 `nativexo://paypalpay` 里面的 `nativexo` 替换成你的 android 包名，点击 + 号；注意这里，如果你的 `scheme` 和包名相同，那么会出现报错，就是有可能跳转过后不出现支付界面的情况。

## Installation

npm 的方式：
```sh
npm install @wutiange/react-native-paypal-checkout
如果你的 react-native 的版本低于 0.71.0 ，那么就请下载 0.1.0 以下的版本，比如 0.0.2;否则请下载高版本。
主要是下面的区别，所以下载不同，你也可以下载最新版本，然后手动将下面的地方手动改一下来解决
// For < 0.71, this will be from the local maven repo，也就是`com.facebook.react:react-android:+`
// For > 0.71, this will be replaced by `com.facebook.react:react-android:$version` by react gradle plugin
```
yarn 的方式：
```sh
yarn add @wutiange/react-native-paypal-checkout
```

## android 配置

paypal 需要你开启备份，所以如果你的 app 需要将 `AndroidManifest.xml` 文件中修改下面的代码：
```xml
<application
-       android:allowBackup="false"
+       android:allowBackup="true">
```

个别手机在登录完成回调的时候可能存在问题，需要修改下面代码，也是在 `AndroidManifest.xml` 文件中， 找到承载 react-native 的Activity ：
```xml
<activity
+  android:launchMode="singleTask">
```
目前测试如果这里的这个值是： `singleInstance` ，那么就有手机在跳转的时候出现问题；但是只要登录成功过就不会有问题。

打开项目的 Application 类，在 onCreate 中添加下面的代码：
```java
public void onCreate() {
  super.onCreate();
  ReactNativePaypalCheckoutModule.Companion.init(this);
  // 你的其他逻辑代码
}
```

如果是 kotlin ，那么这样：
```kotlin
public void onCreate() {
  super.onCreate();
  ReactNativePaypalCheckoutModule.init(this);
  // 你的其他逻辑代码
}
```

打开你项目的 build.gradle 文件，并在下面添加如下代码：
```groovy
allprojects {
  repositories {
    // 需要添加下面的代码
    maven {
      url  "https://cardinalcommerceprod.jfrog.io/artifactory/android"
      credentials {
        // Be sure to add these non-sensitive credentials in order to retrieve dependencies from
        // the private repository.
        username 'paypal_sgerritz'
        password 'AKCp8jQ8tAahqpT5JjZ4FRP2mW7GMoFZ674kGqHmupTesKeAY2G8NcmPKLuTxTGkKjDLRzDUQ'
      }
    }
  }
}
```

## ios 配置
ios 不需要任何配置， pod 会自动做好一切。

## Usage

在使用前需要先使用clientId和secret生成数据，所以现在项目里执行：
```bash
npx wutiange-paypal-checkout  "{                                                                                           17:13:36
  \"xiao\": {
    \"clientId\": \"你的 clientId\",
    \"secret\": \"你的 secret\"
  },
  \"da\": {
    \"clientId\": \"你的另一个 clientId\",
    \"secret\": \"你的另一个 secret\"
  }
 }"
```
然后才进行下面的操作。下面 `config` 中的 `accountType` 的值就是上面的 `key` ，比如 `xiao` 和 `da` 。
```js
import Paypal, {
  tokenQuickStart,
} from '@wutiange/react-native-paypal-checkout';

// ...
// 先配置
try {
  Paypal.config({
    accountType: 'xiao',
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
} catch (error) {
  console.warn('error-------11111----', error);
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
