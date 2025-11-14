const jwt = require("jsonwebtoken");

// ✅ Middleware to verify admin token
exports.verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only." });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error("Admin Auth Error:", error.message);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};
