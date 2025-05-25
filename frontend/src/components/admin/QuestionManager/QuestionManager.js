import React, { useState, useEffect } from 'react';
import './QuestionManager.css';

const QuestionManager = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setQuestions([
        {
          id: 1,
          content: 'Câu hỏi mẫu 1',
          subject: 'Toán học',
          difficulty: 'Dễ',
          type: 'Trắc nghiệm'
        },
        {
          id: 2,
          content: 'Câu hỏi mẫu 2',
          subject: 'Vật lý',
          difficulty: 'Trung bình',
          type: 'Tự luận'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="question-manager">
      <h2>Quản lý câu hỏi</h2>
      <div className="question-list">
        {questions.map(question => (
          <div key={question.id} className="question-card">
            <h3>{question.content}</h3>
            <p>Môn: {question.subject}</p>
            <p>Độ khó: {question.difficulty}</p>
            <p>Loại: {question.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionManager;