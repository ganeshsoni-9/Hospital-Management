export const adminMiddleware = (req, res, next) => {
  try {
    // req.user JWT middleware se aana chahiye
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // role check
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};