import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../App"; // Adjust path as needed

const DashboardCard = ({ title, value, icon }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-7 py-6 shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100">
        {/* Placeholder for an icon */}
        <span className="text-xl text-blue-600">{icon}</span>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-2xl font-bold text-black">{value}</h4>
          <span className="text-sm font-medium">{title}</span>
        </div>
      </div>
    </div>
  );
};


const AdminHome = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await axios.get(`${serverUrl}/api/admin/analytics`, {
                    withCredentials: true,
                });
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            }
        };
        fetchAnalytics();
    }, []);

    if (!stats) {
        return <div>Loading analytics...</div>;
    }
  
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7">
        <DashboardCard title="Total Users" value={stats.users} icon="👥" />
        <DashboardCard title="Total Shops" value={stats.shops} icon="🏪" />
        <DashboardCard title="Total Orders" value={stats.orders} icon="📦" />
        <DashboardCard title="Total Items" value={stats.items} icon="🍔" />
        <DashboardCard title="Owners" value={stats.owners} icon="👨‍💼" />
        <DashboardCard title="Delivery Boys" value={stats.deliveryBoys} icon="🚚" />
      </div>

      <div className="mt-8">
        {/* You can add charts or recent activity logs here */}
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
            {/* Placeholder for activity feed */}
            <p>No recent activity to show.</p>
        </div>
      </div>
    </>
  );
};

export default AdminHome;
