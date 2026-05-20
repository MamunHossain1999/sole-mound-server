import { Request, Response } from "express";
import { Banner } from "./banner.model";

/* ================= CREATE BANNER ================= */

export const createBanner = async (req:Request, res:Response) => {
  try {
    console.log(req.file);
    console.log(req.body);

    if (!req.file) {
      return res.status(400).json({ message: "Image missing" });
    }

    const newBanner = await Banner.create({
      title: req.body.title,
      image: req.file.path, // cloudinary URL
      link: req.body.link,
      description: req.body.description,
    });

    return res.status(201).json(newBanner);
  } catch (error: any) {
    console.log("CREATE BANNER ERROR:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL ================= */
export const getBanners = async (req: Request, res: Response) => {
  try {
    const banners = await Banner.find({});

    res.status(200).json(banners);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Failed to get banners",
    });
  }
};

/* ================= DELETE ================= */
export const deleteBanner = async (req: Request, res: Response) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};