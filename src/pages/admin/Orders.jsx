import { useEffect, useState } from "react";
import { socket } from "../../socket";
import { useNotificationStore } from "../../store/notificationStore";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const addNotification = useNotificationStore(
  (state) => state.addNotification
);

const isDisabled = (currentStatus, newStatus) => {
  const rules = {
    pending: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
  };

  return !rules[currentStatus]?.includes(newStatus);
};

  useEffect(() => {
  fetchOrders();

  socket.on("orderCreated", (data) => {
    setOrders((prev) => [data.order, ...prev]);
  });

  socket.on("orderUpdated", (data) => {
  setOrders((prev) =>
    prev.map((order) =>
      order._id === data.orderId
        ? { ...order, status: data.status }
        : order
    )
  );
});

  return () => {
    socket.off("orderCreated");
    socket.off("orderUpdated");
  };
}, []);




  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/orders/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/orders/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (res.ok) {
         setOrders((prev) =>
    prev.map((order) =>
      order._id === id
        ? { ...order, status }
        : order
    )
  );


        addNotification({
          message: "Order updated successfully",
          type: "success",
          duration: 3000,
        });
      } else {
        addNotification({
          message: data.message,
          type: "error",
          duration: 3000,
        });
      }
    } 
    catch (err) {
      console.log(err);
    }
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => o.status === filter);

  if (loading) {
  return (
    <div className="p-10 space-y-4">
      <div className="h-6 w-1/3 bg-gray-200 animate-pulse rounded"></div>
      <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
      <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
    </div>
  );
}

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        📦 Orders Management
      </h1>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded ${
                filter === status
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* Table */}
      <div className="grid gap-4 mt-6">

  {filteredOrders.map((order) => (
    <div
      key={order._id}
      className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
    >

      <div className="flex justify-between flex-wrap gap-3">

        <div>
          <p className="text-gray-500 text-sm">
            Order ID
          </p>
          <h2 className="font-bold">
            #{order._id.slice(-6)}
          </h2>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Customer</p>
          <h2 className="font-semibold">
            {order.user?.name}
          </h2>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Email</p>
          <h2 className="text-sm text-gray-600">
            {order.user?.email}
          </h2>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Total</p>
          <h2 className="font-bold text-green-600">
            ${order.totalPrice}
          </h2>
        </div>

        <div className="flex items-center gap-3">

          <select
            value={order.status}
            onChange={(e) =>
              updateStatus(order._id, e.target.value)
            }
            className="border rounded-lg p-2"
          >
            <option value="pending">pending</option>
            <option value="processing">processing</option>
            <option value="shipped">shipped</option>
            <option value="delivered">delivered</option>
            <option value="cancelled">cancelled</option>
          </select>

        </div>

      </div>

    </div>
  ))}
</div>
    </div>
  );
}