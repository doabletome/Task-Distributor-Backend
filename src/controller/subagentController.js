import bcrypt from "bcrypt";
import User from "../models/User.js";
import TaskItem from "../models/TaskItem.js";
// Agent or Admin can create a subagent
export async function createSubAgent(req, res) {
  const { name, email, phone, password } = req.body;
  const parent = req.user._id;
  const role = req.user.role === "admin" ? "agent" : "subagent";
  // Admin creating: role=agent; Agent creating: role=subagent

  // Hash password & create
  const hash = bcrypt.hashSync(password, 10);
  const user = await User.create({
    name,
    email,
    phone,
    password: hash,
    role,
    parentAgent: parent,
  });
  res.status(201).json(user);
}

// List only subagents under this agent (or all agents if admin)
export async function listSubAgents(req, res) {
  try {
    // Ensure only agents can access this route
    if (req.user.role !== "agent") {
      return res
        .status(403)
        .json({ message: "Only agents can access subagents." });
    }

    // Return all subagents regardless of parentAgent
    const subs = await User.find({ role: "subagent" }).select("-password");
    res.json(subs);
  } catch (err) {
    console.error("Error fetching subagents:", err);
    res.status(500).json({ message: "Server error fetching subagents" });
  }
}

// Edit subagent: only if you own it (or admin can edit any agent)

export async function editAgentOrSubagent(req, res) {
  try {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: "Not found" });

    // Admin can edit any agent
    if (req.user.role === "admin") {
      Object.assign(target, req.body);
    }
    // Agent can only edit subagents they created
    else if (
      req.user.role === "agent" &&
      String(target.parentAgent) === String(req.user._id)
    ) {
      Object.assign(target, req.body);
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }

    await target.save();
    return res.json({ message: "Updated", updated: target });
  } catch (err) {
    console.error("editAgentOrSubagent error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
// Delete subagent with same ownership logic
export async function deleteSubAgent(req, res) {
  const { id } = req.params;
  const target = await User.findById(id);
  console.log(req.user);
  if (!target) return res.status(404).send("Not found");
  if (
    req.user.role === "agent" &&
    String(target.parentAgent) !== String(req.user._id)
  ) {
    return res.status(403).send("Forbidden");
  }
  await target.deleteOne();
  res.json({ message: "Deleted" });
}

export async function getAllSubAndTask(req, res) {
  try {
    // Ensure the requester is an agent
    if (req.user.role !== "agent") {
      return res.status(403).json({ message: "Only agents can access this." });
    }

    const agentId = req.user._id;

    // 1. Find all subagents created by this agent
    const subagents = await User.find({
      parentAgent: agentId, // ✅ Only fetch subagents under the current agent
      role: "subagent",
    })
      .select("name email _id")
      .lean();

    // 2. Fetch tasks for each subagent
    const data = await Promise.all(
      subagents.map(async (sub) => {
        const tasks = await TaskItem.find({ assignedTo: sub._id }).lean();
        return {
          subagent: {
            id: sub._id,
            name: sub.name,
            email: sub.email,
          },
          tasks,
        };
      })
    );

    res.json(data);
  } catch (err) {
    console.error("getAllSubAndTask error:", err);
    res
      .status(500)
      .json({ message: "Server error retrieving subagents and tasks." });
  }
}
