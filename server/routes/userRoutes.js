// server/routes/userRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const authenticateJWT  = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// ✅ Admin creates new user
router.post("/", authenticateJWT, roleMiddleware("admin"), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user with plain password; hashing done by schema middleware
    const newUser = new User({
      name,
      email,
      password,
      role: role.toLowerCase(),
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error("User creation error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Get all users (excluding current admin)
router.get("/", authenticateJWT, roleMiddleware("admin"), async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// ✅ Update user
router.put("/:id", authenticateJWT, roleMiddleware("admin"), async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select("-password");

    res.json({ message: "User updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
});

// ✅ Delete user
router.delete("/:id", authenticateJWT, roleMiddleware("admin"), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

module.exports = router;
