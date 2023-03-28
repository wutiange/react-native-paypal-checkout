package com.wutiange.reactnativepaypalcheckout

import com.paypal.checkout.config.Environment
import com.paypal.checkout.createorder.CurrencyCode
import com.paypal.checkout.createorder.OrderIntent
import com.paypal.checkout.createorder.UserAction

fun getEnvironment(data: String?): Environment {
    return when (data) {
        "SANDBOX" -> Environment.SANDBOX
        "LIVE" -> Environment.LIVE
        "LOCAL" -> Environment.LOCAL
        else -> Environment.STAGE
    }
}

private fun getUserAction(data: String?): UserAction {
    return when (data) {
        "PAY_NOW" -> UserAction.PAY_NOW
        "CONTINUE" -> UserAction.CONTINUE
        else -> UserAction.PAY_NOW
    }
}

private fun getOrderIntent(data: String?): OrderIntent {
    return when (data) {
        "CAPTURE" -> OrderIntent.CAPTURE
        "AUTHORIZE" -> OrderIntent.AUTHORIZE
        else -> OrderIntent.AUTHORIZE
    }
}

/**
 * 国家支付编码
 */
private fun getCurrencyCode(data: String?): CurrencyCode {
    return when (data) {
        "AUD" -> CurrencyCode.AUD;
        "BRL" -> CurrencyCode.BRL;
        "CAD" -> CurrencyCode.CAD;
        "CNY" -> CurrencyCode.CNY;
        "CZK" -> CurrencyCode.CZK;
        "DKK" -> CurrencyCode.DKK;
        "EUR" -> CurrencyCode.EUR;
        "HKD" -> CurrencyCode.HKD;
        "HUF" -> CurrencyCode.HUF;
        "INR" -> CurrencyCode.INR;
        "ILS" -> CurrencyCode.ILS;
        "JPY" -> CurrencyCode.JPY;
        "MYR" -> CurrencyCode.MYR;
        "MXN" -> CurrencyCode.MXN;
        "TWD" -> CurrencyCode.TWD;
        "NZD" -> CurrencyCode.NZD;
        "NOK" -> CurrencyCode.NOK;
        "PHP" -> CurrencyCode.PHP;
        "PLN" -> CurrencyCode.PLN;
        "GBP" -> CurrencyCode.GBP;
        "RUB" -> CurrencyCode.RUB;
        "SGD" -> CurrencyCode.SGD;
        "SEK" -> CurrencyCode.SEK;
        "CHF" -> CurrencyCode.CHF;
        "THB" -> CurrencyCode.THB;
        "USD" -> CurrencyCode.USD;

        else -> CurrencyCode.USD;
    }
}

fun String.toCurrencyCode(): CurrencyCode {
    return getCurrencyCode(this)
}

fun String.toEnvironment(): Environment {
    return getEnvironment(this)
}

fun String.toUserAction(): UserAction {
    return getUserAction(this)
}

fun String.toOrderIntent(): OrderIntent {
    return getOrderIntent(this)
}
