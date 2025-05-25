import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StatisticsPage = () => {
  const [stats, setStats] = useState({
    users: [],
    exams: [],
    contributions: []
  });

  useEffect(() => {
    Promise.all([
      axios.get('/api/statistics/users'),
      axios.get('/api/statistics/exams'),
      axios.get('/api/statistics/contributions')
    ])
      .then(([usersRes, examsRes, contribRes]) => {
        setStats({
          users: usersRes.data,
          exams: examsRes.data,
          contributions: contribRes.data
        });
      })
      .catch(error => console.error('Error fetching stats:', error));
  }, []);

  return (
    <div className="statistics-page">
      <h1>Thống kê</h1>
      
      <div className="stats-section">
        <h2>Danh sách thành viên</h2>
        {stats.users.map(user => (
          <p key={user.id}>{user.name} - {user.email}</p>
        ))}
      </div>

      <div className="stats-section">
        <h2>Bộ đề thi</h2>
        {stats.exams.map(exam => (
          <p key={exam.id}>{exam.title} - {exam.questionCount} câu</p>
        ))}
      </div>

      <div className="stats-section">
        <h2>Câu hỏi đóng góp</h2>
        {stats.contributions.map(contrib => (
          <p key={contrib.id}>{contrib.text} - {contrib.user}</p>
        ))}
      </div>
    </div>
  );
};

export default StatisticsPage;