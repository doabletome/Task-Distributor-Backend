// server/src/routes/subagents.js
import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { authorizeRole } from "../middleware/authorize.js";
import {
  createSubAgent,
  listSubAgents,
  editAgentOrSubagent,
  deleteSubAgent,
  getAllSubAndTask,
} from "../controller/subagentController.js";

const router = Router();

// Agents & Admins can create subagents (or agents)
router.post("/", auth, authorizeRole("agent", "admin"), createSubAgent);

// Agents see their subs; Admin sees all agents
router.get("/", auth, authorizeRole("agent", "admin"), listSubAgents);

// Edit by owner or admin
router.put("/:id", auth, editAgentOrSubagent);

// Delete by owner or admin
router.delete("/:id", auth, authorizeRole("agent", "admin"), deleteSubAgent);

router.get("/tasks", auth, getAllSubAndTask);

export default router;
