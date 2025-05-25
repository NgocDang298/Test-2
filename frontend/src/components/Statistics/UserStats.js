import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getUserStats } from '../../api/stats';

const UserStats = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      const stats = await getUserStats();
      setData({
        labels: stats.months,
        datasets: [{
          label: 'Thành viên hoạt động',
          data: stats.activeUsers,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }],
      });
    };
    fetchStats();
  }, []);

  return <Bar data={data} />;
};

export default UserStats;