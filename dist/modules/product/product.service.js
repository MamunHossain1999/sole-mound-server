"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductService = exports.deleteProductService = exports.rejectProductService = exports.approveProductService = exports.getSingleProductService = exports.getAllProductsService = exports.createProductService = void 0;
const product_model_1 = require("./product.model");
// CREATE
const createProductService = async (data) => {
    return await product_model_1.Product.create(data);
};
exports.createProductService = createProductService;
// GET ALL
const getAllProductsService = async () => {
    return await product_model_1.Product.find();
};
exports.getAllProductsService = getAllProductsService;
// GET SINGLE PRODUCT
const getSingleProductService = async (id) => {
    const product = await product_model_1.Product.findById(id);
    return product;
};
exports.getSingleProductService = getSingleProductService;
// APPROVE
const approveProductService = async (id) => {
    return await product_model_1.Product.findByIdAndUpdate(id, { status: "active" }, { new: true });
};
exports.approveProductService = approveProductService;
// REJECT
const rejectProductService = async (id) => {
    return await product_model_1.Product.findByIdAndUpdate(id, { status: "rejected" }, { new: true });
};
exports.rejectProductService = rejectProductService;
// DELETE
const deleteProductService = async (id) => {
    return await product_model_1.Product.findByIdAndDelete(id);
};
exports.deleteProductService = deleteProductService;
// UPDATE (PARTIAL)
const updateProductService = async (id, data) => {
    return await product_model_1.Product.findByIdAndUpdate(id, { $set: data }, {
        new: true,
        runValidators: true,
        returnDocument: "after",
    });
};
exports.updateProductService = updateProductService;
