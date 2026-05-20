"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const topCategory_controller_1 = require("./topCategory.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const bestSeller_controller_1 = require("./bestSeller.controller");
const router = express_1.default.Router();
/* ================= PUBLIC ================= */
router.get("/best-sellers", bestSeller_controller_1.getBestSellers);
router.get("/top-categories", topCategory_controller_1.getTopCategories);
router.get("/all-categories", topCategory_controller_1.getAllCategories);
router.get("/category/:name", topCategory_controller_1.getSingleCategory);
/* ================= PROTECTED ================= */
// ✅ status update (FIXED)
router.put("/category-status/:name", auth_middleware_1.protect, (0, role_middleware_1.authorize)("seller", "admin"), topCategory_controller_1.updateCategoryStatus);
// ✅ delete (working)
router.delete("/category/:name", auth_middleware_1.protect, (0, role_middleware_1.authorize)("seller", "admin"), topCategory_controller_1.deleteCategory);
exports.default = router;
