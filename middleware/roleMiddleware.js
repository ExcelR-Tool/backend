exports.authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.student.role !== role) {
      return res.status(403).json({ message: "Access denied: Unauthorized role." });
    }
    next();
  };
};
