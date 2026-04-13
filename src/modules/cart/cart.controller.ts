import { Response } from "express";
import { Cart } from "./cart.model";

/* =========================
   ADD TO CART
========================= */
export const addToCart = async (req: any, res: any) => {
  const { productId, quantity, discount } = req.body;

  let cart = await Cart.findOne({ user: req.user.id });

  // create cart if not exists
  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: [{ product: productId, quantity, discount }],
    });

    return res.json({
      success: true,
      data: cart,
    });
  }

  // check existing product
  const item = cart.items.find(
    (i: any) => i.product.toString() === productId
  );

  if (item) {
    item.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();

  res.json({
    success: true,
    message: "Cart updated",
    data: cart,
  });
};

/* =========================
   GET CART
========================= */
export const getCart = async (req: any, res: Response) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate(
    "items.product"
  );

  if (!cart) {
    return res.json({
      success: true,
      data: { items: [] },
    });
  }

  // 🔥 remove null products safely
  cart.items = cart.items.filter((item: any) => item.product !== null);

  res.json({
    success: true,
    data: cart,
  });
};

/* =========================
   UPDATE QUANTITY
========================= */
export const updateCartQuantity = async (req: any, res: Response) => {
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found",
    });
  }

  const item = cart.items.find(
    (i: any) => i.product.toString() === productId
  );

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Item not found",
    });
  }

  item.quantity = quantity;

  await cart.save();

  res.json({
    success: true,
    message: "Quantity updated",
    data: cart,
  });
};

/* =========================
   REMOVE SINGLE ITEM
========================= */
export const removeFromCart = async (req: any, res: Response) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found",
    });
  }

  cart.items = cart.items.filter(
    (i: any) => i.product.toString() !== productId
  );

  await cart.save();

  res.json({
    success: true,
    message: "Item removed",
    data: cart,
  });
};

/* =========================
   CLEAR CART
========================= */
export const clearCart = async (req: any, res: any) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found",
    });
  }

  // 🔥 ALL ITEMS DELETE
  cart.items = [];

  await cart.save();

  return res.json({
    success: true,
    message: "Cart cleared successfully",
    data: cart,
  });
};