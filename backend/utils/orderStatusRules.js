export const allowedTransitions = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export const canChangeStatus = (current, next) => {
  return allowedTransitions[current]?.includes(next);
};