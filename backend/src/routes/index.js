import { Router } from "express";

import admin from "./admin/index.js";
import api from "./api/index.js";

const router = new Router();

router.use("/admin", admin);
router.use("/api", api);

export default router;