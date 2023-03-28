import PayPalCheckout

@objc(ReactNativePaypalCheckout)
class ReactNativePaypalCheckout: NSObject {

  @objc(config:)
    func config(map: NSDictionary) {
        let clientId = map["clientId"] as! String
        let environment = map["environment"] as! String
        let userAction = map["userAction"] as? String
        let currencyCode = map["currencyCode"] as? String
        let loggingEnabled = map["loggingEnabled"] as! Bool
        
        let config = CheckoutConfig(clientID: clientId, environment: getEnvironment(data: environment))
        config.debugEnabled = loggingEnabled;
        config.currencyCode = getCurrencyCode(data: currencyCode)
        config.userAction = getUserAction(data: userAction);
        Checkout.set(config: config)
    }
    
    @objc(startSetPayPalPay:withApprovalType:withResolver:withRejecter:)
    func startSetPayPalPay(orderId: String, approvalType: String, resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock) -> Void {
        Checkout.setCreateOrderCallback { action in
            action.set(orderId: orderId)
        }
        onResult(approvalType: approvalType, resolve: resolve, reject: reject)
        Checkout.start()
    }
    
    private func onResult(approvalType: String, resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock) -> Void {
        
        Checkout.setOnApproveCallback { approval in
            if (approvalType == "capture") {
                approval.actions.capture { response,error  in
                    if((error) != nil){
                        reject("approvalError", "approvalError", error);
                    } else{
                        resolve(response);
                    }
                }
            } else if (approvalType == "authorize") {
                approval.actions.authorize { response, error in
                    if((error) != nil){
                        reject("approvalError", "approvalError", error);
                    } else{
                        resolve(response);
                    }
                }
            }
        }
        
        Checkout.setOnCancelCallback {
            print("取消了这个订单");
            reject("onCancel","onCancel","Cancel" as? Error);
        }
        
        Checkout.setOnErrorCallback { errorInfo in
            reject("onError", "onError", errorInfo.error);
            print("Order successfully captured: \(errorInfo.error)");
        }
    }
}
