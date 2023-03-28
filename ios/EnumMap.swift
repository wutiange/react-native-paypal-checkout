//
//  EnumMap.swift
//  react-native-paypal-checkout
//
//  Created by admin on 2023/3/27.
//

import Foundation
import PayPalCheckout


func getEnvironment(data: String)-> Environment {
    switch(data) {
        case "LIVE":
            return .live
        case "SANDBOX":
            return .sandbox
        default:
            return .stage
    }
}

func getUserAction(data: String?) -> UserAction {
    guard let data = data else { return .payNow }
    switch data {
    case "PAY_NOW":
        return .payNow
    case "CONTINUE":
        return .continue
    default:
        return .payNow
    }
}

func getCurrencyCode(data: String?) -> CurrencyCode {
    guard let data = data else { return CurrencyCode.usd }
    switch data {
    case "AUD":
        return .aud
    case "BRL":
        return .brl
    case "CAD":
        return .cad
    case "CNY":
        return .cny
    case "CZK":
        return .czk
    case "DKK":
        return .dkk
    case "EUR":
        return .eur
    case "HKD":
        return .hkd
    case "HUF":
        return .huf
    case "INR":
        return .inr
    case "ILS":
        return .ils
    case "JPY":
        return .jpy
    case "MYR":
        return .myr
    case "MXN":
        return .mxn
    case "TWD":
        return .twd
    case "NZD":
        return .nzd
    case "NOK":
        return .nok
    case "PHP":
        return .php
    case "PLN":
        return .pln
    case "GBP":
        return .gbp
    case "RUB":
        return .rub
    case "SGD":
        return .sgd
    case "SEK":
        return .sek
    case "CHF":
        return .chf
    case "THB":
        return .thb
    case "USD":
        return .usd
    default:
        return .usd
    }
}
