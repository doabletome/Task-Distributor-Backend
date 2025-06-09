export function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    // auth middleware must have already run and set req.user
    const role = req.user?.role;
    if (!role || !allowedRoles.includes(role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient privileges" });
    }
    next();
  };
}
