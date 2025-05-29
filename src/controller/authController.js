import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// login controller
export async function login(req, res) {
  try {
    //getting email and password from user
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //checking if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "invalid credential" });
    }

    //matching password
    const ismatch = bcrypt.compareSync(password, user.password);

    if (!ismatch) {
      return res.status(400).json({ message: "invalid credential" });
    }

    //creating jwt token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, role: user.role });
  } catch (error) {
    res.json({ message: "unable to login", errorMessage: error.message });
  }
}
