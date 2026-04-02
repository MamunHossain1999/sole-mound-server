import { Types } from "mongoose";

export interface IProduct {
  name: string;
  category?: string;
  tags?: string[];
  description?: string;

  status?: "Low Stock" | "Published" | "Draft" | "Out of Stock";

  images?: string[];
  video?: string;

  price: number;
  discount?: number;
  tax?: boolean;

  sku?: string;
  barcode?: string;
  quantity?: number;

  variants?: {
    option: string;
    values: string[];
  }[];

  shipping?: {
    isDigital: boolean;
    weight?: number;
    height?: number;
    length?: number;
  };

  // 🔥 FIX HERE
  sellerId: Types.ObjectId;
}

