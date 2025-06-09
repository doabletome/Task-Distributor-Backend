// import User from "../models/User.js";
// import bcrypt from "bcrypt";

// // TO get all agents
// export async function getAll(req, res) {
//   try {
//     const agents = await User.find({ role: "agent" });
//     if (!agents) {
//       return res.status(404).json({ message: "No agents were found" });
//     }
//     return res.status(200).json(agents);
//   } catch (error) {
//     res.status(500).json({ message: "interval server error" });
//   }
// }

// // to create agent
// export async function create(req, res) {
//   try {
//     // extracting all the field given by user
//     const { name, email, phone, password } = req.body;
//     if (!name || !email || !phone || !password) {
//       return res.status(401).json({ message: "All fields are required" });
//     }

//     //checking if user exists
//     const exist = await User.findOne({ email });
//     if (exist) {
//       return res.status(200).json({ message: "Agent already exists" });
//     }

//     //creating hash password
//     const hashed = bcrypt.hashSync(password, 10);

//     //creating new agent
//     const newAgent = await User.create({
//       name,
//       email,
//       password: hashed,
//       phone,
//       role: "agent",
//     });

//     res.status(200).json({ newAgent, message: "agent created" });
//   } catch (error) {
//     res.status(500).json({ message: "internal server error" });
//   }
// }

// export async function deleteAgent(req, res) {
//   try {
//     const { id } = req.params;
//     const target = await User.findById(id);
//     if (!target) {
//       return res.status(404).json({ message: "Agent not found." });
//     }
//     // Ensure target is an agent
//     if (target.role !== "agent") {
//       return res
//         .status(400)
//         .json({ message: "Can only delete users with role 'agent'." });
//     }
//     await target.deleteOne();
//     return res.json({ message: "Agent deleted." });
//   } catch (err) {
//     console.error("deleteAgent error:", err);
//     return res.status(500).json({ message: "Server error deleting agent." });
//   }
// }

import User from "../models/User.js";
import TaskItem from "../models/TaskItem.js"; // <— import your task model
import bcrypt from "bcrypt";

// TO get all agents
export async function getAll(req, res) {
  try {
    const agents = await User.find({ role: "agent" });
    if (!agents) {
      return res.status(404).json({ message: "No agents were found" });
    }
    return res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({ message: "interval server error" });
  }
}

// to create agent
export async function create(req, res) {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(401).json({ message: "All fields are required" });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(200).json({ message: "Agent already exists" });
    }

    const hashed = bcrypt.hashSync(password, 10);

    const newAgent = await User.create({
      name,
      email,
      password: hashed,
      phone,
      role: "agent",
    });

    res.status(200).json({ newAgent, message: "agent created" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
}

export async function deleteAgent(req, res) {
  try {
    const { id } = req.params;
    const target = await User.findById(id);
    if (!target) {
      return res.status(404).json({ message: "Agent not found." });
    }

    if (target.role !== "agent") {
      return res
        .status(400)
        .json({ message: "Can only delete users with role 'agent'." });
    }

    // 1) Delete all tasks assigned to this agent
    await TaskItem.deleteMany({ assignedTo: target._id });

    // 2) Delete the agent
    await target.deleteOne();

    return res.json({ message: "Agent and their tasks have been deleted." });
  } catch (err) {
    console.error("deleteAgent error:", err);
    return res.status(500).json({ message: "Server error deleting agent." });
  }
}
