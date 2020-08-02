export interface Auth {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  nonce: string;
}

export interface OrderDetails {
  id: string;
  intent: string;
  purchase_units: PurchaseUnit[];
  payer: Payer;
  create_time: string;
  update_time: string;
  links: Link[];
  status: string;
}

interface Link {
  href: string;
  rel: string;
  method: string;
}

interface Payer {
  name: PayerName;
  email_address: string;
  payer_id: string;
  address: PayerAddress;
}

interface PayerAddress {
  country_code: string;
}

interface PayerName {
  given_name: string;
  surname: string;
}

interface PurchaseUnit {
  reference_id: string;
  amount: Amount;
  payee: Payee;
  description: string;
  soft_descriptor: string;
  shipping: Shipping;
  payments: Payments;
}

interface Amount {
  currency_code: string;
  value: string;
}

interface Payee {
  email_address: string;
  merchant_id: string;
}

interface Payments {
  captures: Capture[];
}

interface Capture {
  id: string;
  status: string;
  status_details: StatusDetails;
  amount: Amount;
  final_capture: boolean;
  seller_protection: SellerProtection;
  links: Link[];
  create_time: string;
  update_time: string;
}

interface SellerProtection {
  status: string;
  dispute_categories: string[];
}

interface StatusDetails {
  reason: string;
}

interface Shipping {
  name: ShippingName;
  address: ShippingAddress;
}

interface ShippingAddress {
  address_line_1: string;
  address_line_2: string;
  admin_area_2: string;
  admin_area_1: string;
  postal_code: string;
  country_code: string;
}

interface ShippingName {
  full_name: string;
}
