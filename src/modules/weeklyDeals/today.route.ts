import { Router } from "express";
import { getWeeklyDeals, getTodayDeals } from "./today.controller";


const router = Router();

router.get("/deals/weekly", getWeeklyDeals);
router.get("/deals/today", getTodayDeals);

const weeklyDealsRoutes = router;
export default weeklyDealsRoutes;