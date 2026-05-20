import express, { Request, Response } from "express";
import Stats from "./stats.model";
import { visitorMiddleware } from "../../middlewares/visitor.middleware";

const router = express.Router();

// ✅ VISIT + GET COUNT (same route)
router.get("/visitor", visitorMiddleware, async (req: Request, res: Response) => {
  try {
    let stats = await Stats.findOne();

    if (!stats) {
      stats = await Stats.create({ visitors: 0 });
    }

    res.json({
      success: true,
      visitors: stats.visitors,
    });
  } catch (error) {
    console.error("Visitor error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get visitors",
    });
  }
});


const statsRoute = router;
export default statsRoute;