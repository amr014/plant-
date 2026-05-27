import { useNotificationStore } from "../store/notificationStore";

export const notify = (type, message, duration = 3000) => {
  const { addNotification } =
    useNotificationStore.getState();

  addNotification({
    type,
    message,
    duration,
  });
};