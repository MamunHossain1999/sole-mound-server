import { z } from "zod";

export const productValidationSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Product name required"),

    category: z.string().optional(),

    tags: z.array(z.string()).optional(),

    description: z.string().optional(),

    status: z.enum(["Low Stock", "Published", "Draft", "Out of Stock"]).optional(),

    price: z
      .number()
      .positive("Price must be positive"),

    discount: z
      .number()
      .min(0)
      .max(100)
      .optional(),

    tax: z.boolean().optional(),

    sku: z.string().optional(),
    barcode: z.string().optional(),

    quantity: z.number().min(0).optional(),

    variants: z
      .array(
        z.object({
          option: z.string(),
          values: z.array(z.string()),
        })
      )
      .optional(),

    shipping: z
      .object({
        isDigital: z.boolean(),
        weight: z.number().optional(),
        height: z.number().optional(),
        length: z.number().optional(),
      })
      .optional(),
  }),
});