import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar, FaEdit, FaSave, FaTimes, FaCamera, FaUpload } from "react-icons/fa";
import API from "../api/axios";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    profilePicture: "",
    bio: "",
    dateOfBirth: "",
    gender: "",
    country: "",
    favoriteGenres: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (user && user.token) {
      API
        .get("/api/users/me", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => setUserData({
          ...res.data,
          username: res.data.username || "",
          profilePicture: res.data.profilePicture || "",
          bio: res.data.bio || "",
          dateOfBirth: res.data.dateOfBirth || "",
          gender: res.data.gender || "",
          country: res.data.country || "",
          favoriteGenres: res.data.favoriteGenres || [],
        }))
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setMessage("Please upload an image file");
      setMessageType("error");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size should be less than 5MB");
      setMessageType("error");
      return;
    }

    setUploadingImage(true);

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await API.put(
          "/api/users/update-profile",
          { profilePicture: reader.result },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        
        setUserData({ ...userData, profilePicture: reader.result });
        
        // Update user context
        if (res.data.user) {
          setUser({ ...user, ...res.data.user });
        }
        
        setMessage("Profile picture updated successfully!");
        setMessageType("success");
        setTimeout(() => setMessage(""), 3000);
      } catch (err) {
        setMessage("Error uploading image!");
        setMessageType("error");
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(
        "/api/users/update-profile",
        userData,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      
      // Update user context with new data
      if (res.data.user) {
        setUser({ ...user, ...res.data.user });
      }
      
      setMessage(res.data.message || "Profile updated successfully!");
      setMessageType("success");
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error updating profile!");
      setMessageType("error");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-12 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 mb-6"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Picture */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative group"
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-500 to-pink-500 p-1 shadow-lg shadow-red-500/50">
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                  {userData.profilePicture ? (
                    <img 
                      src={userData.profilePicture} 
                      alt={userData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl font-bold">
                      {userData.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
              </div>
              <label 
                htmlFor="profile-picture-upload"
                className="absolute bottom-0 right-0 bg-gradient-to-r from-red-600 to-pink-600 p-2 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer"
              >
                {uploadingImage ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <FaCamera className="text-white" />
                )}
              </label>
              <input
                id="profile-picture-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </motion.div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-black bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
                {userData.name || "User"}
              </h1>
              {userData.username && (
                <p className="text-gray-400 mb-1">@{userData.username}</p>
              )}
              <p className="text-gray-400 mb-1 flex items-center justify-center md:justify-start gap-2">
                <FaEnvelope className="text-red-500" />
                {userData.email}
              </p>
              {userData.bio && (
                <p className="text-gray-300 mt-3 italic">"{userData.bio}"</p>
              )}
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-500/50 hover:shadow-red-500/70 transition-all flex items-center gap-2"
              >
                <FaEdit />
                Edit Profile
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Message Alert */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl ${
              messageType === "success"
                ? "bg-green-500/10 border border-green-500/50 text-green-400"
                : "bg-red-500/10 border border-red-500/50 text-red-400"
            }`}
          >
            {message}
          </motion.div>
        )}

        {/* Profile Details */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleUpdate}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              Profile Details
            </h2>
            {isEditing && (
              <div className="flex gap-2">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2"
                >
                  <FaSave />
                  Save
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleCancel}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 px-4 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2"
                >
                  <FaTimes />
                  Cancel
                </motion.button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Full Name
              </label>
              <div className="relative group">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </motion.div>

            {/* Username */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Username
              </label>
              <div className="relative group">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="text"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter username"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  disabled
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 opacity-60 cursor-not-allowed"
                />
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Phone Number
              </label>
              <div className="relative group">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="text"
                  name="phone"
                  value={userData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter phone number"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </motion.div>

            {/* Date of Birth */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Date of Birth
              </label>
              <div className="relative group">
                <FaCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={userData.dateOfBirth}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </motion.div>

            {/* Gender */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={userData.gender}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="" className="bg-gray-900">Select Gender</option>
                <option value="male" className="bg-gray-900">Male</option>
                <option value="female" className="bg-gray-900">Female</option>
                <option value="other" className="bg-gray-900">Other</option>
              </select>
            </motion.div>

            {/* Country */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Country
              </label>
              <div className="relative group">
                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="text"
                  name="country"
                  value={userData.country}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter country"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </motion.div>
          </div>

          {/* Address - Full Width */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6"
          >
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Address
            </label>
            <div className="relative group">
              <FaMapMarkerAlt className="absolute left-4 top-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
              <textarea
                name="address"
                value={userData.address}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your full address"
                rows="3"
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed resize-none"
              />
            </div>
          </motion.div>

          {/* Bio - Full Width */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-6"
          >
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={userData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Tell us about yourself..."
              rows="4"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed resize-none"
            />
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
};

export default Profile;

