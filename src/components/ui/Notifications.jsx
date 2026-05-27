import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationStore } from "../../store/notificationStore";

export default function Notifications() {
  const {
    notifications,
    removeNotification,
  } = useNotificationStore();

  useEffect(() => {
    notifications.forEach((n) => {
      if (!n.duration) return;

      const timer = setTimeout(() => {
        removeNotification(n.id);
      }, n.duration);

      return () => clearTimeout(timer);
    });
  }, [notifications]);

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3">

      <AnimatePresence>

        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`
              min-w-[280px]
              px-4 py-3 rounded-2xl shadow-lg text-white
              flex justify-between items-center
              ${
                n.type === "success"
                  ? "bg-green-600"
                  : n.type === "error"
                  ? "bg-red-600"
                  : n.type === "warning"
                  ? "bg-yellow-500 text-black"
                  : "bg-blue-600"
              }
            `}
          >

            <span className="text-sm font-medium">
              {n.message}
            </span>

            <button
              onClick={() =>
                removeNotification(n.id)
              }
              className="ml-3 text-lg font-bold"
            >
              ×
            </button>

          </motion.div>
        ))}

      </AnimatePresence>

    </div>
  );
}