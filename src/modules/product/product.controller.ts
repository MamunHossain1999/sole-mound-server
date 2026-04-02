import { Request, Response } from "express";
import {
  createProductService,
  getAllProductsService,
  approveProductService,
  rejectProductService,
  deleteProductService,
  updateProductService,
  getSingleProductService,
} from "./product.service";

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

    const tags = Array.isArray(req.body.tags)
      ? req.body.tags
      : [req.body.tags];

    const productData = {
      ...req.body,
      price: Number(req.body.price), // ✅ FIX
      tags, // ✅ FIX
      sellerId: req.user.id, // ✅ FIX
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
export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await getAllProductsService();

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// GET SINGLE PRODUCT
export const getSingleProduct = async (
  req: Request<{ id: string }>,
  res: Response
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
  res: Response
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
  res: Response
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
  res: Response
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
  res: Response
) => {
  try {
    const images = req.files as Express.Multer.File[];

    let updateData: any = { ...req.body };

    // যদি image আসে তাহলে update
    if (images && images.length > 0) {
      const imageUrls = images.map((file) => file.path);
      updateData.images = imageUrls;
    }

    const product = await updateProductService(
      req.params.id,
      updateData
    );

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};