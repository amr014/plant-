export const permissions = {
  owner: [
    "orders:update",
    "orders:view",
    "orders:delete",
    "users:view",
    "analytics:view",
  ],

  admin: [
    "orders:update",
    "orders:view",
    "analytics:view",
  ],
};

export const hasPermission = (role, action) => {
  return permissions[role]?.includes(action);
};