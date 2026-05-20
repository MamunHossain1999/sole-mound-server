import { Types } from "mongoose";

export interface IProduct {
  // ========================
  // BASIC INFO
  // ========================
  name: string;
  category: string;

  categoryStatus?: "active" | "inactive"; // ✅ ADD THIS

  tags?: string[];
  description?: string;

  status?: "Low Stock" | "Published" | "Draft" | "Out of Stock";

  images?: string[];
  video?: string;

  // ========================
  // PRICE INFO
  // ========================
  price: number;
  discount?: number;
  tax?: boolean;

  isBestSeller: boolean;

  // ========================
  // DEAL SYSTEM
  // ========================
  dealType?: "weekly" | "today" | "none";

  label: "hot" | "new" | "sale" | "sold out" | "none";

  startDate?: Date | null;
  endDate?: Date | null;

  brand?: string;

  // ========================
  // INVENTORY
  // ========================
  sku?: string;
  barcode?: string;
  quantity?: number;

  // ========================
  // VARIANTS
  // ========================
  variants?: {
    option: string;
    values: string[];
  }[];

  // ========================
  // ANALYTICS
  // ========================
  views: number;
  salesCount: number;
  wishlistCount: number;

  trendingScore?: number;

  // ========================
  // SHIPPING
  // ========================
  shipping?: {
    isDigital: boolean;
    weight?: number;
    height?: number;
    length?: number;
  };

  // ========================
  // RELATIONS
  // ========================
  sellerId: Types.ObjectId;

  // ========================
  // RATINGS
  // ========================
  ratingsAverage?: number;
  ratingsCount?: number;

  // ========================
  // TIMESTAMPS
  // ========================
  createdAt?: Date;
  updatedAt?: Date;
}