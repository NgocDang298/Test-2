import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TakeExamPage = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    axios.get(`/api/exams/${id}`)
      .then(response => setExam(response.data))
      .catch(error => console.error('Error fetching exam:', error));
  }, [id]);

  const handleAnswer = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    exam.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correctCount++;
    });
    setScore(correctCount);
    setSubmitted(true);
    
    // Gửi kết quả lên server
    axios.post('/api/submit-exam', { examId: id, answers, score: correctCount });
  };

  if (!exam) return <p>Đang tải...</p>;

  return (
    <div className="take-exam-page">
      <h1>{exam.title}</h1>
      {exam.questions.map((question, index) => (
        <div key={question.id} className="question">
          <p>{index + 1}. {question.text}</p>
          {question.options.map((option, idx) => (
            <label key={idx}>
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                onChange={() => handleAnswer(question.id, option)}
                disabled={submitted}
              />
              {option}
            </label>
          ))}
        </div>
      ))}
      {!submitted && <button onClick={handleSubmit}>Nộp bài</button>}
      {submitted && <p>Kết quả: {score}/{exam.questions.length}</p>}
    </div>
  );
};

export default TakeExamPage;