#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ReactNativePaypalCheckout, NSObject)


RCT_EXTERN_METHOD(config:(NSDictionary*)map)
RCT_EXTERN_METHOD(startSetPayPalPay:(NSString *)orderId withApprovalType:(NSString *)approvalType
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
