import React, { useState, useEffect } from 'react';
import './ExamManager.css';
const ExamManager = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setExams([
        {
          id: 1,
          title: 'Kiểm tra Toán học cơ bản',
          subject: 'Toán học',
          duration: '60 phút',
          questions: 20,
          difficulty: 'Dễ'
        },
        {
          id: 2,
          title: 'Kiểm tra Vật lý nâng cao',
          subject: 'Vật lý',
          duration: '90 phút',
          questions: 30,
          difficulty: 'Khó'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="exam-manager">
      <h2>Quản lý bài thi</h2>
      <div className="exam-list">
        {exams.map(exam => (
          <div key={exam.id} className="exam-card">
            <h3>{exam.title}</h3>
            <p>Môn: {exam.subject}</p>
            <p>Thời gian: {exam.duration}</p>
            <p>Số câu hỏi: {exam.questions}</p>
            <p>Độ khó: {exam.difficulty}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamManager;