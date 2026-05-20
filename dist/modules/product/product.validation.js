"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidationSchema = void 0;
const zod_1 = require("zod");
exports.productValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(3, "Product name required"),
        category: zod_1.z.string().optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        description: zod_1.z.string().optional(),
        status: zod_1.z.enum(["Low Stock", "Published", "Draft", "Out of Stock"]).optional(),
        price: zod_1.z
            .number()
            .positive("Price must be positive"),
        discount: zod_1.z
            .number()
            .min(0)
            .max(100)
            .optional(),
        tax: zod_1.z.boolean().optional(),
        sku: zod_1.z.string().optional(),
        barcode: zod_1.z.string().optional(),
        quantity: zod_1.z.number().min(0).optional(),
        variants: zod_1.z
            .array(zod_1.z.object({
            option: zod_1.z.string(),
            values: zod_1.z.array(zod_1.z.string()),
        }))
            .optional(),
        shipping: zod_1.z
            .object({
            isDigital: zod_1.z.boolean(),
            weight: zod_1.z.number().optional(),
            height: zod_1.z.number().optional(),
            length: zod_1.z.number().optional(),
        })
            .optional(),
    }),
});
