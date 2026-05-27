import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Package,
  Settings,
  Camera,
  Mail,
  Phone,
  MapPin,
  Shield,
} from "lucide-react";

import { useAuthStore } from "../../store/authStore";
import { formatPrice } from "../../utils/currency";

export default function Profile() {
  const user = useAuthStore((state) => state.user);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [activeTab, setActiveTab] =
    useState("profile");

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [profileData, setProfileData] =
    useState({
      name: "",
      email: "",
      phone: "",
      address: "",
      avatar: "",
    });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");


const handleChangePassword = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/users/change-password",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert("Password changed successfully 🔒");
      setOldPassword("");
      setNewPassword("");
    } else {
      alert(data.message || "Error changing password");
    }
  } catch (err) {
    console.log(err);
  }
};

    const [uploading, setUploading] =
  useState(false);
  

  // fetch profile
 useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setProfileData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        avatar: data.avatar || "",
      });

    } catch (err) {
      console.log(err);
    }
  };

  fetchProfile();
}, []);

  // fetch orders
  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/orders/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const ordersData = await res.json();

      setOrders(ordersData || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);

  const handleAvatarUpload = async (e) => {
  try {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    // preview فوري (UX SaaS)
    const previewUrl = URL.createObjectURL(file);
    setProfileData((prev) => ({
      ...prev,
      avatar: previewUrl,
    }));

    const formData = new FormData();
    formData.append("avatar", file);

    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/users/avatar",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await res.json();

    setProfileData((prev) => ({
      ...prev,
      avatar: data.avatar,
    }));

    setUploading(false);
  } catch (err) {
    console.log(err);
    setUploading(false);
  }
};

  // save profile
  const handleSave = async () => {
  try {
    setSaving(true);

    const token = localStorage.getItem("token");

    await fetch("http://localhost:5000/api/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    setSaving(false);
    alert("Profile Updated Successfully ✅");
  } catch (err) {
    console.log(err);
    setSaving(false);
  }
};

  return (
    <div className="section min-h-screen bg-gradient-to-b from-[#f6fff8] to-white">

      <div className="container-custom">

        {/* HEADER */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-white rounded-[35px] p-8 shadow-sm border border-gray-100 mb-10"
        >

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

            <div className="flex items-center gap-6">

              {/* avatar */}
              <div className="relative">

                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-100 shadow-lg">

                  {profileData.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-5xl font-bold">
                      {profileData.name?.charAt(0)}
                    </div>
                  )}

                  {
  uploading && (
    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white text-sm">
      Uploading...
    </div>
  )
}

                </div>

                <label className="absolute bottom-1 right-1 bg-green-600 text-white p-2 rounded-full shadow-lg hover:scale-110 transition cursor-pointer">

  <Camera size={18} />

  <input
    type="file"
    hidden
    onChange={
      handleAvatarUpload
    }
  />

</label>

              </div>

              {/* info */}
              <div>

                <h1 className="text-4xl font-bold mb-2">
                  {profileData.name ||
                    "Plant Lover 🌱"}
                </h1>

                <p className="text-gray-500 mb-4">
                  Manage your account &
                  orders
                </p>

                <div className="flex flex-wrap gap-3">

                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-2xl text-sm font-medium">
                    Premium Member
                  </div>

                  <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-2xl text-sm font-medium">
                    {orders.length} Orders
                  </div>

                </div>

              </div>

            </div>

            

            {/* stats */}
            <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">

              <div className="bg-green-50 rounded-3xl p-5 text-center min-w-[140px]">

                <h3 className="text-3xl font-bold text-green-600">
                  {orders.length}
                </h3>

                <p className="text-gray-500 text-sm">
                  Orders
                </p>

              </div>

              <div className="bg-orange-50 rounded-3xl p-5 text-center min-w-[140px]">

                <h3 className="text-3xl font-bold text-orange-500">
                  🌿
                </h3>

                <p className="text-gray-500 text-sm">
                  Plant Lover
                </p>

              </div>

            </div>

          </div>

        </motion.div>

        {/* CONTENT */}
        <div className="grid lg:grid-cols-4 gap-8">

          {/* SIDEBAR */}
          <div className="bg-white rounded-[30px] p-6 shadow-sm border border-gray-100 h-fit">

            <div className="space-y-3">

              

              <button
                onClick={() =>
                  setActiveTab("profile")
                }
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition ${
                  activeTab === "profile"
                    ? "bg-green-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >

                <User size={20} />

                Profile Info

              </button>

              <button
                onClick={() =>
                  setActiveTab("orders")
                }
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition ${
                  activeTab === "orders"
                    ? "bg-green-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >

                <Package size={20} />

                My Orders

              </button>

              <button
                onClick={() =>
                  setActiveTab("settings")
                }
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition ${
                  activeTab === "settings"
                    ? "bg-green-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >

                <Settings size={20} />

                Settings

              </button>

            </div>

          </div>

          {/* MAIN */}
          <div className="lg:col-span-3">

            {/* PROFILE */}
            {activeTab === "profile" && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="bg-white rounded-[30px] p-8 shadow-sm border border-gray-100"
              >

                <h2 className="text-3xl font-bold mb-8">
                  Personal Information
                </h2>

                <div className="grid md:grid-cols-2 gap-6">

                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">
                      Full Name
                    </label>

                    <div className="relative">

                      <User
                        size={18}
                        className="absolute left-4 top-4 text-gray-400"
                      />

                      <input
                        type="text"
                        value={
                          profileData.name
                        }
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name:
                              e.target.value,
                          })
                        }
                        className="input pl-12"
                      />

                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">
                      Email
                    </label>

                    <div className="relative">

                      <Mail
                        size={18}
                        className="absolute left-4 top-4 text-gray-400"
                      />

                      <input
                        type="email"
                        value={
                          profileData.email
                        }
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email:
                              e.target.value,
                          })
                        }
                        className="input pl-12"
                      />

                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">
                      Phone
                    </label>

                    <div className="relative">

                      <Phone
                        size={18}
                        className="absolute left-4 top-4 text-gray-400"
                      />

                      <input
                        type="text"
                        value={
                          profileData.phone
                        }
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone:
                              e.target.value,
                          })
                        }
                        className="input pl-12"
                      />

                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">
                      Address
                    </label>

                    <div className="relative">

                      <MapPin
                        size={18}
                        className="absolute left-4 top-4 text-gray-400"
                      />

                      <input
                        type="text"
                        value={
                          profileData.address
                        }
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            address:
                              e.target.value,
                          })
                        }
                        className="input pl-12"
                      />

                    </div>
                  </div>

                </div>

                <button
  onClick={handleSave}
  disabled={saving}
  className="btn-primary mt-8"
>
  {saving ? "Saving..." : "Save Changes 💾"}
</button>

              </motion.div>
            )}

            {/* ORDERS */}
            {activeTab === "orders" && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="space-y-5"
              >

                {loading ? (
                  <div className="card">
                    Loading orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-[30px] p-14 text-center shadow-sm border border-gray-100">

                    <div className="text-7xl mb-5">
                      📦
                    </div>

                    <h3 className="text-3xl font-bold mb-3">
                      No Orders Yet
                    </h3>

                    <p className="text-gray-500">
                      Start shopping now 🌿
                    </p>

                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-white rounded-[30px] p-6 shadow-sm border border-gray-100"
                    >

                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                        <div>

                          <h3 className="text-2xl font-bold mb-2">
                            Order #
                            {order._id.slice(
                              -6
                            )}
                          </h3>

                          <p className="text-gray-500">
                            {new Date(
                              order.createdAt
                            ).toLocaleDateString()}
                          </p>

                        </div>

                        <div className="bg-green-100 text-green-700 px-5 py-2 rounded-2xl font-medium w-fit">
                          {order.status ||
                            "Processing"}
                        </div>

                      </div>

                      <div className="mt-6 space-y-3">

                        {order.products?.map(
                          (item, i) => (
                            <div
                              key={i}
                              className="flex justify-between"
                            >

                              <span>
                                {item.name} ×{" "}
                                {item.qty}
                              </span>

                              <span className="font-semibold">
                                {formatPrice(
                                  item.price *
                                    item.qty
                                )}
                              </span>

                            </div>
                          )
                        )}

                      </div>

                      <div className="border-t mt-6 pt-5 flex justify-between text-xl font-bold">

                        <span>Total</span>

                        <span className="text-green-600">
                          {formatPrice(
                            order.totalPrice
                          )}
                        </span>

                      </div>

                    </div>
                  ))
                )}

              </motion.div>
            )}

            {/* SETTINGS */}
            {activeTab === "settings" && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="bg-white rounded-[30px] p-8 shadow-sm border border-gray-100"
              >

                <h2 className="text-3xl font-bold mb-8">
                  Account Settings
                </h2>

                <div className="space-y-5">

                  <div className="flex flex-col gap-4 p-5 bg-gray-50 rounded-2xl">

  <div className="flex items-center gap-4">
    <Shield className="text-green-600" />

    <div>
      <h3 className="font-bold">Account Security</h3>
      <p className="text-gray-500 text-sm">
        Protect your account
      </p>
    </div>
  </div>

  <input
    type="password"
    placeholder="Old Password"
    value={oldPassword}
    onChange={(e) => setOldPassword(e.target.value)}
    className="input"
  />

  <input
    type="password"
    placeholder="New Password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    className="input"
  />

  <button
    onClick={handleChangePassword}
    className="btn-primary"
  >
    Update Password 🔒
  </button>

                  </div>

                  <div className="flex items-center justify-between p-5 bg-red-50 rounded-2xl">

                    <div>

                      <h3 className="font-bold text-red-600">
                        Logout
                      </h3>

                      <p className="text-sm text-gray-500">
                        Sign out from account
                      </p>

                    </div>

                    <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl transition">
                      Logout
                    </button>

                  </div>

                </div>

              </motion.div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}