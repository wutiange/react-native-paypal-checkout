#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ReactNativePaypalCheckout, NSObject)


RCT_EXTERN_METHOD(config:(NSDictionary*)map)
RCT_EXTERN_METHOD(startSetPayPalPay:(NSString *)orderId withApprovalType:(NSString *)approvalType
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
