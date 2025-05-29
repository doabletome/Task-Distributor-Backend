import User from "../models/User.js";
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
    // extracting all the field given by user
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(401).json({ message: "All fields are required" });
    }

    //checking if user exists
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(200).json({ message: "Agent already exists" });
    }

    //creating hash password
    const hashed = bcrypt.hashSync(password, 10);

    //creating new agent
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
