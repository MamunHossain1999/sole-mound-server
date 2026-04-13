import { Router } from "express";
import { getWeeklyDeals, getTodayDeals } from "./today.controller";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();

router.get("/deals/weekly",protect,authorize("user","seller","admin"), getWeeklyDeals);
router.get("/deals/today",protect,authorize("user","seller","admin"), getTodayDeals);

const weeklyDealsRoutes = router;
export default weeklyDealsRoutes;