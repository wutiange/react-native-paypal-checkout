interface OrderDao {
  /**
   * The date and time when the transaction occurred, in [Internet date and time format](https://tools.ietf.org/html/rfc3339#section-5.6).
   */
  create_time: string;
  /**
   * The date and time when the transaction was last updated, in [Internet date and time format](https://tools.ietf.org/html/rfc3339#section-5.6).
   */
  update_time?: string;
  /**
   * The ID of the order.
   */
  id: string;
  /**
   * 
Default: "NO_INSTRUCTION"

The instruction to process an order.
   */
  processing_instruction?: OrderProcessingInstruction;

  /**
   * An array of purchase units. Each purchase unit establishes a contract between a customer and merchant. Each purchase unit represents either a full or partial order that the customer intends to purchase from the merchant.
   */
  purchase_units: PurchaseUnitDao[];

  /**
   * An array of request-related HATEOAS links. To complete payer approval, use the `approve` link to redirect the payer. The API caller has 3 hours (default setting, this which can be changed by your account manager to 24/48/72 hours to accommodate your use case) from the time the order is created, to redirect your payer. Once redirected, the API caller has 3 hours for the payer to approve the order and either authorize or capture the order. If you are not using the PayPal JavaScript SDK to initiate PayPal Checkout (in context) ensure that you include `application_context.return_url` is specified or you will get "We're sorry, Things don't appear to be working at the moment" after the payer approves the payment.
   */
  links: OrderLinks[];

  /**
   * The payment source used to fund the payment.
   */
  payment_source?: PaymentSourceDao;

  /**
   * The intent to either capture payment immediately or authorize a payment for an order after order creation.
   */
  intent?: OrderIntent;

  /**
   * The customer who approves and pays for the order. The customer is also known as the payer.
   */
  payer?: PayerDao;

  /**
   * The order status.
   */
  status?: OrderStatus;

  /**
   * error message
   */
  message?: string;
}

interface OrderPaymentSource {
  paypal: OrderPayer;
}

interface OrderPayer {
  name: OrderPayerName;
  email_address: string;
  payer_id: string;
}

interface OrderPayerName {
  given_name: string;
  surname: string;
}

interface OrderPurchaseUnits {
  reference_id: string;
  amount: OrderPurchaseUnitsAmount;
}

interface OrderPurchaseUnitsAmount {
  currency_code: string;
  value: string;
}

interface OrderLinks {
  href?: string;
  rel?: string;
  method?: string;
}

enum OrderProcessingInstruction {
  /**
   * API Caller expects the Order to be auto completed (i.e. for PayPal to authorize or capture depending on the intent) on completion of payer approval. This option is not relevant for payment_source that typically do not require a payer approval or interaction. This option is currently only available for the following payment_source: Alipay, Bancontact, BLIK, boletobancario, eps, giropay, GrabPay, iDEAL, Multibanco, MyBank, OXXO, P24, PayU, PUI, SafetyPay, SatisPay, Sofort, Trustly, Verkkopankki, WeChat Pay
   */
  ORDER_COMPLETE_ON_PAYMENT_APPROVAL = 'ORDER_COMPLETE_ON_PAYMENT_APPROVAL',
  /**
   * The API caller intends to authorize `v2/checkout/orders/id/authorize` or capture `v2/checkout/orders/id/capture` after the payer approves the order.
   */
  NO_INSTRUCTION = 'NO_INSTRUCTION',
}

enum OrderIntent {
  /**
   * The merchant intends to capture payment immediately after the customer makes a payment.
   */
  CAPTURE = 'CAPTURE',
  /**
   * The merchant intends to authorize a payment and place funds on hold after the customer makes a payment. Authorized payments are best captured within three days of authorization but are available to capture for up to 29 days. After the three-day honor period, the original authorized payment expires and you must re-authorize the payment. You must make a separate request to capture payments on demand. This intent is not supported when you have more than one purchase_unit within your order.
   */
  AUTHORIZE = 'AUTHORIZE',
}

enum OrderStatus {
  /**
   * The order was created with the specified context.
   */
  CREATED = 'CREATED',

  /**
   * The order was saved and persisted. The order status continues to be in progress until a capture is made with `final_capture = true` for all purchase units within the order.
   */
  SAVED = 'SAVED',

  /**
   * The customer approved the payment through the PayPal wallet or another form of guest or unbranded payment. For example, a card, bank account, or so on.
   */
  APPROVED = 'APPROVED',

  /**
   * All purchase units in the order are voided.
   */
  VOIDED = 'VOIDED',

  /**
   * The payment was authorized or the authorized payment was captured for the order.
   */
  COMPLETED = 'COMPLETED',

  /**
   * The order requires an action from the payer (e.g. 3DS authentication). Redirect the payer to the "rel":"payer-action" HATEOAS link returned as part of the response prior to authorizing or capturing the order.
   */
  PAYER_ACTION_REQUIRED = 'PAYER_ACTION_REQUIRED',
}

export {
  OrderDao,
  OrderPaymentSource,
  OrderPayer,
  OrderPayerName,
  OrderPurchaseUnits,
  OrderPurchaseUnitsAmount,
  OrderLinks,
  OrderProcessingInstruction,
  OrderIntent,
  OrderStatus,
};
