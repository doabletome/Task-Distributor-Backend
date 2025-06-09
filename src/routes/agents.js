import { Router } from "express";
import { getAll, create, deleteAgent } from "../controller/agentController.js";
import { auth } from "../middleware/auth.js";
import { authorizeRole } from "../middleware/authorize.js";
const router = Router();

// making auth middleware apply to all agents routes
router.use(auth);
// get all agents
router.get("/", getAll);
// create agents
router.post("/", create);

router.delete("/:id", auth, authorizeRole("admin"), deleteAgent);
export default router;
