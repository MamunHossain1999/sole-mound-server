import { Request, Response } from "express";
import {
  createProductService,
  approveProductService,
  rejectProductService,
  deleteProductService,
  getSingleProductService,
} from "./product.service";
import { Product } from "./product.model";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}
// CREATE
export const createProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const images = req.files as Express.Multer.File[] | undefined;
    const imageUrls = images ? images.map((file) => file.path) : [];

    // ✅ FIX: JSON parse করো
    const tags =
      typeof req.body.tags === "string"
        ? JSON.parse(req.body.tags)
        : req.body.tags || [];

    const variants =
      typeof req.body.variants === "string"
        ? JSON.parse(req.body.variants)
        : req.body.variants || [];

    const shipping =
      typeof req.body.shipping === "string"
        ? JSON.parse(req.body.shipping)
        : req.body.shipping || {};

    const productData = {
      ...req.body,
      price: Number(req.body.price),
      quantity: Number(req.body.quantity),

      tags,
      variants,
      shipping,

      sellerId: req.user.id,
      images: imageUrls,
    };

    const product = await createProductService(productData);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("🔥 ERROR:", error);

    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};


// GET ALL
export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    // 👉 frontend থেকে আসবে (dashboard / public)
    const mode = req.query.mode as string;

    let query: any = {};

    // 🔥 SELLER dashboard → only own products
    if (role === "seller" && mode === "dashboard") {
      query.createdBy = userId;
    }

    // 🔥 USER → all products
    // 🔥 SELLER (public view) → all products
    const products = await Product.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE PRODUCT
export const getSingleProduct = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const product = await getSingleProductService(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

// APPROVE
export const approveProduct = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const product = await approveProductService(req.params.id);

    res.json({
      success: true,
      message: "Product approved",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// REJECT
export const rejectProduct = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const product = await rejectProductService(req.params.id);

    res.json({
      success: true,
      message: "Product rejected",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// DELETE
export const deleteProduct = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const product = await deleteProductService(req.params.id);

    res.json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// UPDATE (PARTIAL + IMAGE)
export const updateProduct = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const images = req.files as Express.Multer.File[] | undefined;

    let updateData: any = {};

    // ✅ only valid fields
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined && req.body[key] !== "") {
        updateData[key] = req.body[key];
      }
    });

    // JSON parse safely
    if (updateData.tags) {
      updateData.tags = JSON.parse(updateData.tags);
    }

    if (updateData.variants) {
      updateData.variants = JSON.parse(updateData.variants);
    }

    if (updateData.shipping) {
      updateData.shipping = JSON.parse(updateData.shipping);
    }

    // 🖼 images update
    if (images && images.length > 0) {
      updateData.images = images.map((file) => file.path);
    }

    if (updateData.dealType === "weekly") {
      const now = new Date();
      updateData.startDate = now;

      const end = new Date(now);
      end.setDate(now.getDate() + 7);

      updateData.endDate = end;
    }

    if (updateData.dealType === "today") {
      const now = new Date();
      updateData.startDate = now;

      const end = new Date(now);
      end.setDate(now.getDate() + 1);

      updateData.endDate = end;
    }

    // ❌ if deal removed
    if (updateData.dealType === "none") {
      updateData.startDate = null;
      updateData.endDate = null;
    }

    // 🔥 UPDATE PRODUCT
    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    );

    return res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};
