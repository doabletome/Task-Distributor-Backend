import multer from "multer";
import { parse } from "csv-parse";
import TaskItem from "../models/TaskItem.js";
import User from "../models/User.js";

// using multer to storage file in buffer
export const upload = multer({ storage: multer.memoryStorage() }).single(
  "file"
);

//distributing algo
export async function parseAndDistribute(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "file required" });
  }

  const role = req.user.role;

  // parse csv
  parse(
    req.file.buffer,
    { columns: true, trime: true },
    async (err, records) => {
      if (err) {
        return res.status(400).json({ message: "Invalid CSV" });
      }

      //validate colums
      for (let r of records) {
        if (!r.FirstName || !r.Phone) {
          return res.status(400).json({ message: "Missing required colums" });
        }
      }

      //getting all the agents
      if (role === "admin") {
        const agents = await User.find({ role: "agent" });
        //totol number of records
        const N = records.length;
        // minimum number to records that each agents will have
        const base = Math.floor(N / agents.length);
        // extra remaining records
        let extra = N % agents.length;
        //pointer to iterate over records
        let idx = 0;
        // empty arr to later push in DB
        const toinsert = [];

        // iterating over all the agents and distributing records
        for (let agent of agents) {
          const count = base + (extra-- > 0 ? 1 : 0);
          const slice = records.slice(idx, idx + count);

          slice.forEach((r) => {
            toinsert.push({
              firstName: r.FirstName,
              phone: r.Phone,
              notes: r.Notes || "",
              assignedTo: agent._id,
            });
          });

          idx += count;
        }

        await TaskItem.insertMany(toinsert);
        res.json({ distributed: toinsert.length });
      } else {
        const agents = await User.find({ role: "subagent" });
        //totol number of records
        const N = records.length;
        // minimum number to records that each agents will have
        const base = Math.floor(N / agents.length);
        // extra remaining records
        let extra = N % agents.length;
        //pointer to iterate over records
        let idx = 0;
        // empty arr to later push in DB
        const toinsert = [];

        // iterating over all the agents and distributing records
        for (let agent of agents) {
          const count = base + (extra-- > 0 ? 1 : 0);
          const slice = records.slice(idx, idx + count);

          slice.forEach((r) => {
            toinsert.push({
              firstName: r.FirstName,
              phone: r.Phone,
              notes: r.Notes || "",
              assignedTo: agent._id,
            });
          });

          idx += count;
        }

        await TaskItem.insertMany(toinsert);
        res.json({ distributed: toinsert.length });
      }
    }
  );
}

// getting all the tasks
export async function getByAgent(req, res) {
  try {
    const { role, _id: userId } = req.user;

    //if user role is agent , we return all the task assigned to it
    if (role === "agent") {
      // Agent: only their own tasks
      const tasks = await TaskItem.find({ assignedTo: userId }).lean();
      return res.json(tasks);
    }

    if (role === "subagent") {
      const tasks = await TaskItem.find({ assignedTo: userId }).lean();
      return res.json(tasks);
    }
    //if user role is admin , we return all the agents and their assigned tasks
    if (role === "admin") {
      // Admin: fetch every agent and their tasks
      const agents = await User.find({ role: "agent" })
        .select("name email _id")
        .lean();

      // For each agent, fetch their tasks
      const data = await Promise.all(
        agents.map(async (agent) => {
          const tasks = await TaskItem.find({ assignedTo: agent._id }).lean();
          return {
            agent: {
              id: agent._id,
              name: agent.name,
              email: agent.email,
            },
            tasks,
          };
        })
      );

      return res.json(data);
    }

    // Other roles: forbidden
    return res.status(403).json({ message: "Forbidden" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error fetching tasks." });
  }
}
