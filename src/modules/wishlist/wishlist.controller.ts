import { Request, Response } from "express";
import { Wishlist } from "./wishlist.mode";


export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;

    const exists = await Wishlist.findOne({
      user: req.user.id,
      product: productId,
    });

    if (exists) {
      return res.json({ success: false, message: "Already in wishlist" });
    }

    await Wishlist.create({
      user: req.user.id,
      product: productId,
    });

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false });
  }
};

export const getWishlist = async (req: any, res: Response) => {
  const data = await Wishlist.find({ user: req.user.id }).populate(
    "product"
  );

  res.json({ success: true, data });
};

export const removeFromWishlist = async (req: any, res: Response) => {
  await Wishlist.findOneAndDelete({
    user: req.user.id,
    product: req.params.productId,
  });

  res.json({ success: true });
};