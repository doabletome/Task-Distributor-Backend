import express from "express";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import agentsRouter from "./routes/agents.js";
import tasksRouter from "./routes/tasks.js";
import cors from "cors";
import subAgentsRouter from "./routes/subagents.js";

dotenv.config();

const app = express();
// connecting to DB
connectDB();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/api/auth", authRouter);
app.use("/api/agents", agentsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/subagents", subAgentsRouter);

//server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`sever is runnig on port ${PORT}`);
});
