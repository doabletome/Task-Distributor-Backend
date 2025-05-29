import { Router } from "express";
import {
  upload,
  parseAndDistribute,
  getByAgent,
} from "../controller/taskController.js";
import { auth } from "../middleware/auth.js";

const router = Router();
// distributing route
router.post("/upload", auth, upload, parseAndDistribute);
// get tasks of one agents  OR all agents and tasks depending on the role of user
router.get("/agent/:agentId", auth, getByAgent);
export default router;
