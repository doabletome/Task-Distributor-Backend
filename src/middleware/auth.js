// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// // authetication
// // this middleware will check ,if all the reqs contains valid token
// export async function auth(req, res, next) {
//   const token = req.header("Authorization")?.replace("Bearer ", "");
//   if (!token) {
//     return res.status(401).json({ message: "token was not provided" });
//   }

//   try {
//     const { id } = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(id);
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// }

// server/src/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function auth(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
