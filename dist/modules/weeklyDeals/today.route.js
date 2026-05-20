"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const today_controller_1 = require("./today.controller");
const router = (0, express_1.Router)();
router.get("/deals/weekly", today_controller_1.getWeeklyDeals);
router.get("/deals/today", today_controller_1.getTodayDeals);
const weeklyDealsRoutes = router;
exports.default = weeklyDealsRoutes;
