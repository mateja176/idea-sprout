/* eslint-disable camelcase */

export interface WithPaypal {
  paypal?: Paypal;
}

export type GlobalWithPaypal = typeof globalThis & WithPaypal;

export interface Paypal {
  Buttons: (config: {
    createOrder: (_: unknown, actions: Actions) => void;
    onApprove: (_: unknown, actions: Actions) => void;
  }) => { render: (selector: string) => void };
}

export interface Actions {
  order: {
    create: (config: {
      purchase_units: { description: string; amount: { value: number } }[];
    }) => void;
    capture: () => Promise<Order>;
  };
}

export interface Order {
  create_Time: string;
  update_Time: string;
  id: string;
  intent: string;
  status: string;
  payer: Payer;
  purchase_Units: PurchaseUnit[];
  links: Link[];
}

export interface Link {
  href: string;
  rel: string;
  method: string;
  title: string;
}

export interface Payer {
  email_Address: string;
  payer_Id: string;
  address: PayerAddress;
  name: PayerName;
}

export interface PayerAddress {
  country_Code: string;
}

export interface PayerName {
  given_Name: string;
  surname: string;
}

export interface PurchaseUnit {
  reference_Id: string;
  amount: Amount;
  payee: Payee;
  shipping: Shipping;
  payments: Payments;
  description: string;
}

export interface Amount {
  value: string;
  currency_Code: string;
}

export interface Payee {
  email_Address: string;
  merchant_Id: string;
}

export interface Payments {
  captures: Capture[];
}

export interface Capture {
  status: string;
  id: string;
  final_Capture: boolean;
  create_Time: string;
  update_Time: string;
  amount: Amount;
  seller_Protection: SellerProtection;
  links: Link[];
}

export interface SellerProtection {
  status: string;
  dispute_Categories: string[];
}

export interface Shipping {
  name: ShippingName;
  address: ShippingAddress;
}

export interface ShippingAddress {
  address_Line_1: string;
  admin_Area_2: string;
  admin_Area_1: string;
  postal_Code: string;
  country_Code: string;
}

export interface ShippingName {
  full_Name: string;
}
