package com.wutiange.reactnativepaypalcheckout

import android.app.Application
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.gson.Gson
import com.paypal.checkout.PayPalCheckout
import com.paypal.checkout.approve.OnApprove
import com.paypal.checkout.cancel.OnCancel
import com.paypal.checkout.config.CheckoutConfig
import com.paypal.checkout.config.SettingsConfig
import com.paypal.checkout.createorder.CreateOrder
import com.paypal.checkout.error.OnError
import com.paypal.checkout.order.AuthorizeOrderResult
import com.paypal.checkout.order.CaptureOrderResult
import com.paypal.checkout.order.OrderContext
import com.paypal.pyplcheckout.model.CheckoutEnvironment
import com.paypal.pyplcheckout.model.DebugConfigManager

class ReactNativePaypalCheckoutModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

    private fun triggerCustomEvent(data: Any) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("${NAME}_Event", data)
    }

    init {
        PayPalCheckout.registerCallbacks(
            onApprove = OnApprove { approval ->
                val gson = Gson()
                if (DebugConfigManager.getInstance().orderCaptureUrl != null) {
                    approval.orderActions.capture {
                        when (it) {
                            is CaptureOrderResult.Success -> {
                                triggerCustomEvent(WritableNativeMap().apply {
                                    putInt("code", 0)
                                    val json = gson.toJson(it.orderResponse)
                                    putString("message", json)
                                })
                            }
                            is CaptureOrderResult.Error -> {
                                triggerCustomEvent(WritableNativeMap().apply {
                                    putInt("code", -2)
                                    putString("message", it.message)
                                })
                            }
                            else -> {
                                DebugConfigManager.getInstance().orderCaptureUrl = null
                            }
                        }
                    }
                }
                if (DebugConfigManager.getInstance().orderAuthorizeUrl != null) {
                    approval.orderActions.authorize {
                        when (it) {
                            is AuthorizeOrderResult.Success -> {
                                triggerCustomEvent(WritableNativeMap().apply {
                                    putInt("code", 0)
                                    val json = gson.toJson(it.orderResponse)
                                    putString("message", json)
                                })
                            }
                            is AuthorizeOrderResult.Error -> {
                                triggerCustomEvent(WritableNativeMap().apply {
                                    putInt("code", -2)
                                    putString("message", it.message)
                                })
                            }
                            else -> {
                                DebugConfigManager.getInstance().orderAuthorizeUrl = null
                            }
                        }
                    }
                }
            },
            onCancel = OnCancel {
                triggerCustomEvent(WritableNativeMap().apply {
                    putInt("code", 1)
                    putString("message", "User Cancel")
                })
            },
            onError = OnError { errorInfo ->
                triggerCustomEvent(WritableNativeMap().apply {
                    putInt("code", -1)
                    putString("orderId", errorInfo.orderId)
                    putString("message", errorInfo.reason)
                })
            }
        )
    }

  override fun getName(): String {
    return NAME
  }
@ReactMethod
    fun startSetPayPalPay(
        orderId: String,
        orderCaptureUrl: String?,
        orderAuthorizeUrl: String?,
        orderPatchUrl: String?,
        token: String?
    ) {
        PayPalCheckout.startCheckout(CreateOrder {
            DebugConfigManager.getInstance().orderCaptureUrl = orderCaptureUrl
            DebugConfigManager.getInstance().orderAuthorizeUrl = orderAuthorizeUrl
            DebugConfigManager.getInstance().lsatToken = token
            OrderContext.create(orderId, orderCaptureUrl, orderAuthorizeUrl, orderPatchUrl)
            it.set(orderId)
        })
    }

    @ReactMethod
    fun config(cfgMap: ReadableMap) {
        val clientId = cfgMap.getString("clientId")
        val environment = cfgMap.getString("environment")!!.toEnvironment()
        val currencyCode = cfgMap.getString("currencyCode")?.toCurrencyCode()
        val userAction = cfgMap.getString("userAction")?.toUserAction()
        val loggingEnabled = cfgMap.getBoolean("loggingEnabled")
        val shouldFailEligibility = cfgMap.getBoolean("shouldFailEligibility")
        val ce = CheckoutEnvironment()
        cfgMap.getString("stageUrl")?.let { ce.stagingUrl = it }
        cfgMap.getString("port")?.let { ce.port = it }
        DebugConfigManager.getInstance().checkoutEnvironment = ce
        PayPalCheckout.setConfig(
            checkoutConfig = CheckoutConfig(
                application = applicationContext,
                clientId = clientId!!,
                environment = environment,
                currencyCode = currencyCode,
                userAction = userAction,
                settingsConfig = SettingsConfig(
                    loggingEnabled = loggingEnabled,
                    shouldFailEligibility = shouldFailEligibility
                ),
                returnUrl = applicationContext.packageName + "://paypalpay"
            )
        )
    }

    companion object {
        private lateinit var applicationContext: Application
        const val NAME = "ReactNativePaypalCheckout"
        fun init(app: Application) {
            applicationContext = app
        }
    }
}
