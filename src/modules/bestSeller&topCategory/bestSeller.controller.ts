// bestSeller.controller.ts
import { Request, Response } from "express";
import { Product } from "../product/product.model";


export const getBestSellers = async (req: Request, res: Response) => {
  try {
    const products = await Product.find()
      .sort({ sold: -1 }) 
      .limit(8);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch best sellers" });
  }
};