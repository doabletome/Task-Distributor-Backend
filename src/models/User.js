// server/src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  phone: {
    type: String,
    required: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["admin", "agent", "subagent"],
    default: "agent",
  },

  // If this user is a sub-agent, who is their parent agent?
  parentAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Optional: don’t return the password when .toJSON() or .toObject()
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);
export default User;
