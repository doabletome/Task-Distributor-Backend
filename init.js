import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";
import bcrypt from "bcrypt";
import TaskItem from "./src/models/TaskItem.js";
dotenv.config();

async function init() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB");

    // delete all previous data
    await User.deleteMany({});
    await TaskItem.deleteMany({});
    console.log("previous data deleted");

    // new data insertion
    await User.create({
      name: "Admin",
      email: "admin@examplegmail.com",
      phone: "+917799228171",
      password: bcrypt.hashSync("adminpass", 10),
      role: "admin",
    });

    console.log("admin created");

    const agents = [];
    for (let i = 1; i <= 5; i++) {
      agents.push({
        name: `Agent${i}`,
        email: `agent${i}@example.com`,
        phone: `+91100000000${i}`,
        password: bcrypt.hashSync("agentpass", 10),
        role: "agent",
      });
    }

    await User.insertMany(agents);
    console.log("5 agent inserted");

    mongoose.connection.close();
    console.log("connection closed");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

init();
