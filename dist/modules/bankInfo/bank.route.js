"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const bankInfo_controller_1 = require("./bankInfo.controller");
const withdraw_controller_1 = require("./withdraw.controller");
const role_middleware_1 = require("../../middlewares/role.middleware");
const router = express_1.default.Router();
router.post("/bank", auth_middleware_1.protect, (0, role_middleware_1.authorize)("seller", "admin"), bankInfo_controller_1.saveBankInfo);
router.get("/bank", auth_middleware_1.protect, (0, role_middleware_1.authorize)("seller", "admin"), bankInfo_controller_1.getBankInfo);
router.post("/withdraw", auth_middleware_1.protect, (0, role_middleware_1.authorize)("seller", "admin"), withdraw_controller_1.createWithdraw);
router.get("/withdraw", auth_middleware_1.protect, (0, role_middleware_1.authorize)("seller", "admin"), withdraw_controller_1.getWithdraws);
router.patch("/withdraw/:id", auth_middleware_1.protect, (0, role_middleware_1.authorize)("seller", "admin"), withdraw_controller_1.updateWithdrawStatus);
const bankRoute = router;
exports.default = bankRoute;
