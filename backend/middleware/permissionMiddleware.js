import { hasPermission } from "../utils/permissions.js";

export const authorizePermission = (action) => {
  return (req, res, next) => {
    const role = req.user.role;

    if (!hasPermission(role, action)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};