const User = require("../models/userModel");

// ✅ Get Logged-in User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Update User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, username, phone, address, profilePicture } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.username = username || user.username;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    res.json({ message: "Profile updated successfully!", user: { name: user.name, username: user.username, email: user.email, profilePicture: user.profilePicture } });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};
