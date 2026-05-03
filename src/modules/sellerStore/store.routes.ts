import express from "express";
import {
  getStore,
  saveStore,
  getStoreStats,
} from "./store.controller";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";


const router = express.Router();

router.get("/store", protect,authorize("seller","admin"), getStore);
router.post("/store",protect,authorize("seller","admin"), saveStore);
router.get("/stats", protect,authorize("seller","admin"), getStoreStats);

const storeApi = router;
export default storeApi;