"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const store_controller_1 = require("./store.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const router = express_1.default.Router();
router.get("/store", auth_middleware_1.protect, (0, role_middleware_1.authorize)("seller", "admin"), store_controller_1.getStore);
router.post("/store", auth_middleware_1.protect, (0, role_middleware_1.authorize)("seller", "admin"), store_controller_1.saveStore);
router.get("/stats", auth_middleware_1.protect, (0, role_middleware_1.authorize)("seller", "admin"), store_controller_1.getStoreStats);
const storeApi = router;
exports.default = storeApi;
