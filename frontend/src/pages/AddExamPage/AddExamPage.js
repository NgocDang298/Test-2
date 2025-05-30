import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AddExamPage.css';

const AddExamPage = () => {
  const [examTitle, setExamTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const onAddExam = location.state?.onAddExam; // Nhận hàm onAddExam từ ExamManager

  const handleAddQuestion = () => {
    setQuestions([...questions, { id: questions.length + 1, text: '', answers: [], correctAnswer: null }]);
  };

  const handleAddAnswer = (questionId) => {
    setQuestions(
      questions.map((question) =>
        question.id === questionId
          ? { ...question, answers: [...question.answers, { id: question.answers.length + 1, text: '' }] }
          : question
      )
    );
  };

  const handleSaveExam = () => {
    const newExam = {
      id: Date.now(),
      title: examTitle,
      subject,
      questions,
    };

    if (onAddExam) {
      onAddExam(newExam); // Gọi hàm thêm đề thi
    }

    navigate('/admin/exams'); // Quay lại trang quản lý đề thi
  };

  return (
    <div className="add-exam-page">
      <h1>Thêm đề thi</h1>
      <div>
        <label>Tên đề thi:</label>
        <input
          type="text"
          value={examTitle}
          onChange={(e) => setExamTitle(e.target.value)}
          placeholder="Nhập tên đề thi"
        />
      </div>
      <div>
        <label>Môn học:</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Nhập môn học"
        />
      </div>
      <div>
        <h3>Câu hỏi:</h3>
        {questions.map((question, index) => (
          <div key={question.id} className="question-container">
            <label>Câu hỏi {index + 1}:</label>
            <input
              type="text"
              value={question.text}
              onChange={(e) => {
                const updatedQuestions = [...questions];
                updatedQuestions[index].text = e.target.value;
                setQuestions(updatedQuestions);
              }}
              placeholder="Nhập nội dung câu hỏi"
            />
            <h4>Đáp án:</h4>
            {question.answers.map((answer, answerIndex) => (
              <div key={answer.id} className="answer-container">
                <label>Đáp án {answerIndex + 1}:</label>
                <input
                  type="text"
                  value={answer.text}
                  onChange={(e) => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[index].answers[answerIndex].text = e.target.value;
                    setQuestions(updatedQuestions);
                  }}
                  placeholder="Nhập nội dung đáp án"
                />
                <input
                  type="radio"
                  name={`correctAnswer-${question.id}`}
                  checked={question.correctAnswer === answer.id}
                  onChange={() => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[index].correctAnswer = answer.id;
                    setQuestions(updatedQuestions);
                  }}
                />
                <label>Đáp án đúng</label>
              </div>
            ))}
            <button onClick={() => handleAddAnswer(question.id)}>+ Thêm đáp án</button>
          </div>
        ))}
        <button onClick={handleAddQuestion}>+ Thêm câu hỏi</button>
      </div>
      <button className="save-button" onClick={handleSaveExam}>
        Lưu đề thi
      </button>
    </div>
  );
};

export default AddExamPage;