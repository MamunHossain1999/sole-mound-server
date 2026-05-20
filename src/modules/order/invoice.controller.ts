import { Request, Response } from "express";
import { Order } from "../order/order.model";
import mongoose from "mongoose";
import PDFDocument from "pdfkit";

// ================= TYPES =================
interface OrderProduct {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

interface OrderType {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  shippingAddress: ShippingAddress;
  products: OrderProduct[];
  totalAmount: number;
}

export const downloadInvoice = async (req: Request, res: Response) => {
  try {
    // ================= SAFE ID =================
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id",
      });
    }

    // ================= FETCH ORDER =================
    const order = (await Order.findById(id).lean()) as OrderType | null;

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ================= PDF INIT =================
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order._id}.pdf`
    );

    doc.pipe(res);

    // ================= HEADER =================
    doc
      .fontSize(22)
      .fillColor("#A8537B")
      .text("YOUR SHOP NAME", { align: "center" });

    doc
      .fontSize(14)
      .fillColor("#444")
      .text("INVOICE", { align: "center" });

    doc.moveDown(2);

    // ================= ORDER INFO =================
    doc
      .fontSize(12)
      .fillColor("#000")
      .text(`Invoice No: INV-${order._id}`);

    doc.text(`Date: ${new Date(order.createdAt).toDateString()}`);

    doc.moveDown(1);

    // ================= CUSTOMER =================
    doc
      .fontSize(14)
      .fillColor("#A8537B")
      .text("Bill To");

    doc
      .fontSize(11)
      .fillColor("#333")
      .text(order.shippingAddress.fullName)
      .text(order.shippingAddress.email)
      .text(order.shippingAddress.phone)
      .text(order.shippingAddress.address);

    doc.moveDown(2);

    // ================= TABLE HEADER =================
    let y = doc.y;

    doc
      .rect(50, y, 500, 22)
      .fill("#A8537B");

    doc
      .fillColor("#fff")
      .fontSize(11)
      .text("Product", 60, y + 6)
      .text("Qty", 260, y + 6)
      .text("Price", 340, y + 6)
      .text("Total", 430, y + 6);

    y += 30;

    // ================= ITEMS =================
    order.products.forEach((p, index) => {
      const total = p.price * p.quantity;

      doc
        .fillColor("#000")
        .fontSize(10)
        .text(`${index + 1}. ${p.name}`, 60, y)
        .text(p.quantity.toString(), 260, y)
        .text(`$${p.price.toFixed(2)}`, 340, y)
        .text(`$${total.toFixed(2)}`, 430, y);

      y += 20;
    });

    doc.moveDown(2);

    // ================= TOTAL BOX =================
    doc
      .fontSize(12)
      .fillColor("#000")
      .text(`Subtotal: $${order.totalAmount.toFixed(2)}`, {
        align: "right",
      });

    doc
      .fontSize(16)
      .fillColor("#A8537B")
      .text(`Grand Total: $${order.totalAmount.toFixed(2)}`, {
        align: "right",
      });

    doc.moveDown(3);

    // ================= FOOTER =================
    doc
      .fontSize(10)
      .fillColor("#888")
      .text("Thank you for your purchase ❤️", {
        align: "center",
      });

    doc.end();
  } catch (error: unknown) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};