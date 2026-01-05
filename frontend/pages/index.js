import { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardCard from '../components/DashboardCard';
import { useRouter } from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/dashboard/overview`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="API Keys" value={data?.apiKeys || 0} icon="🔑" />
        <DashboardCard title="Today Revenue" value={`$${data?.todayRevenue || 0}`} icon="💰" />
        <DashboardCard title="Total Revenue" value={`$${data?.totalRevenue || 0}`} icon="📊" />
        <DashboardCard title="Active Users" value={data?.activeUsers || 0} icon="👥" />
      </div>
    </div>
  );
}
