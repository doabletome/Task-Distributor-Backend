import { Router } from "express";
import { getAll, create } from "../controller/agentController.js";
import { auth } from "../middleware/auth.js";
const router = Router();

// making auth middleware apply to all agents routes
router.use(auth);
// get all agents
router.get("/", getAll);
// create agents
router.post("/", create);
export default router;
