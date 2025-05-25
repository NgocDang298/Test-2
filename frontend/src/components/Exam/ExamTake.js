import React, { useState } from 'react';

const ExamTake = ({ exam }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // Gửi kết quả lên server hoặc xử lý điểm số
  };

  return (
    <div className="exam-take">
      <h2>{exam.title}</h2>
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
      {submitted && <p>Kết quả: {/* Tính điểm */}</p>}
    </div>
  );
};

export default ExamTake;