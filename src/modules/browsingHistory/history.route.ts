import { Router } from "express";
import { addToHistory, clearHistory, deleteHistoryItem, getHistory } from "./history.controller";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();

router.post("/history", protect, authorize("user","seller", "admin"), addToHistory);
router.get("/history", protect, authorize("user","seller", "admin"), getHistory);
router.delete("/history/delete/:id", protect, authorize("user","seller","admin"), deleteHistoryItem);

router.delete("/history/all-delete", protect, authorize("user","seller","admin"), clearHistory);

const historyRoutes = router;
export default historyRoutes;