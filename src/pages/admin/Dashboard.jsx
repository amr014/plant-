import { useEffect, useState } from "react";

export default function Dashboard() {

  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/admin/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setStats(data);

    } catch (err) {
      console.log(err);
    }
  };

  if (!stats) {
    return (
      <div className="p-10">
        Loading Dashboard...
      </div>
    );
  }

  const cards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: "📦",
    },
    {
      title: "Delivered Orders",
      value: stats.deliveredOrders,
      icon: "✅",
    },
    {
      title: "Total Revenue",
      value: `$${stats.revenue}`,
      icon: "💰",
    },
    {
      title: "Users",
      value: stats.totalUsers,
      icon: "👤",
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      icon: "📈",
    },
    {
      title: "Avg Order Value",
      value: `$${Number(
        stats.avgOrderValue
      ).toFixed(2)}`,
      icon: "🛒",
    },
  ];

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-8">
        SaaS Dashboard 🚀
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {cards.map((card) => (

          <div
            key={card.title}
            className="bg-white rounded-3xl shadow p-6 border"
          >

            <div className="flex justify-between items-center">

              <div>
                <p className="text-gray-500 text-sm">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {card.value}
                </h2>
              </div>

              <div className="text-5xl">
                {card.icon}
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}