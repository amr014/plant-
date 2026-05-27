import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import Notifications from "./components/ui/Notifications";
import { socket } from "./socket";
import { useNotificationStore } from "./store/notificationStore";

export default function App() {
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  useEffect(() => {
    socket.on("notification", (data) => {
      addNotification(data);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  return (
    <>
      <Notifications />
      <RouterProvider router={router} />
    </>
  );
}