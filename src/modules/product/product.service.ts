import { Product } from "./product.model";

// CREATE
export const createProductService = async (data: any) => {
  return await Product.create(data);
};

// GET ALL
export const getAllProductsService = async () => {
  return await Product.find();
};

// GET SINGLE PRODUCT
export const getSingleProductService = async (id: string) => {
  const product = await Product.findById(id);

  return product;
};

// APPROVE
export const approveProductService = async (id: string) => {
  return await Product.findByIdAndUpdate(
    id,
    { status: "active" },
    { new: true }
  );
};

// REJECT
export const rejectProductService = async (id: string) => {
  return await Product.findByIdAndUpdate(
    id,
    { status: "rejected" },
    { new: true }
  );
};

// DELETE
export const deleteProductService = async (id: string) => {
  return await Product.findByIdAndDelete(id);
};

// UPDATE (PARTIAL)
export const updateProductService = async (
  id: string,
  data: any
) => {
  return await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};