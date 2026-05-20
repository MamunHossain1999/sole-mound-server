import { Types } from "mongoose";

export interface IOrderProduct {
  productId: string;
  name?: string;
  image?: string;
  quantity: number;
  price: number;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface IBillingAddress {
  fullName: string;
  phone: string;
  address: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export type OrderStatus = "pending" | "processing" | "on_the_way" | "pickup" | "completed" | "cancelled";

export type PaymentStatus = "unpaid" | "paid" | "failed";

export type PaymentMethod = "stripe" | "sslcommerz" | "cash";

export type ShippingMethod = "standard" | "express" | "pickup";

export interface IOrder {
  _id?: string;

  userId: Types.ObjectId | string;

  products: IOrderProduct[];

  totalAmount: number;

  paymentStatus: PaymentStatus;

  status: OrderStatus;

  shippingAddress: IShippingAddress;
  billingAddress?: IBillingAddress;

  shippingMethod?: ShippingMethod; // ✅ ADDED

  returnStatus?: "none" | "requested" | "approved" | "rejected" | "returned";
  returnReason?: string;
  returnRequestedAt?: Date | null;

  transactionId?: string | null;

  paymentMethod?: PaymentMethod;

  comment?: string;

  createdAt?: string;
  updatedAt?: string;
}
