import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, message, Spin, Progress, Radio, Checkbox } from "antd";
import axiosInstance from "../../services/axiosInstance";
import "./HsTakeExamPage.css";

const HsTakeExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [choices, setChoices] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [examInfo, setExamInfo] = useState(location.state?.examInfo || null);
  const [answers, setAnswers] = useState({});
  const [sentAnswers, setSentAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(undefined);
  const [submissionId, setSubmissionId] = useState(null);
  const [isRestored, setIsRestored] = useState(false);
  const timerRef = useRef(null);

  // Khôi phục trạng thái từ localStorage khi load lại trang
  useEffect(() => {
    if (!examId) return;
    const savedAnswers = localStorage.getItem(`exam_${examId}_answers`);
    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));

    const savedSent = localStorage.getItem(`exam_${examId}_sentAnswers`);
    if (savedSent) setSentAnswers(JSON.parse(savedSent));

    const savedSubId = localStorage.getItem(`exam_${examId}_submissionId`);
    if (savedSubId) setSubmissionId(savedSubId);

    
    const savedStart = localStorage.getItem(`exam_${examId}_startTime`);
    const savedTime = localStorage.getItem(`exam_${examId}_timeLeft`);
    if (savedStart && savedTime) {
      const now = Date.now();
      const elapsed = Math.floor((now - Number(savedStart)) / 1000);
      const remain = Number(savedTime) - elapsed;
      setTimeLeft(remain > 0 ? remain : 0);
    }
    setIsRestored(true);
  }, [examId]);

  useEffect(() => {
    if (examInfo) return;
    const fetchExamInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get(`/api/student/subject/exam/${examId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExamInfo(res.data);
      } catch {
        message.error("Không thể tải thông tin đề thi");
      }
    };
    fetchExamInfo();
  }, [examId, examInfo]);

  // Tạo submission khi đã có examInfo và chưa có submissionId
  useEffect(() => {
    if (!examInfo || submissionId) return;
    const createSubmission = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.post(
            `/api/student/submissions/exam/${examId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubmissionId(res.data.id);
      } catch {
        message.error("Không thể tạo bài làm!");
      }
    };
    createSubmission();
  }, [examInfo, examId, submissionId]);

  // Chỉ set lại timeLeft nếu chưa có timeLeft (tránh reset khi reload)
  useEffect(() => {
    if (examInfo?.duration && timeLeft === undefined && isRestored) {
      setTimeLeft(examInfo.duration * 60);
      // Lưu thời điểm bắt đầu vào localStorage
      localStorage.setItem(`exam_${examId}_startTime`, Date.now());
      localStorage.setItem(`exam_${examId}_timeLeft`, examInfo.duration * 60);
    }
  }, [examInfo, examId, timeLeft, isRestored]);

  // Chỉ fetch câu hỏi khi đã khôi phục xong
  useEffect(() => {
    if (!isRestored) return;
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get(`/api/student/questions/exam/${examId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuestions(res.data);
        // Không reset answers ở đây!
      } catch {
        message.error("Không thể tải câu hỏi");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [examId, isRestored]);

  useEffect(() => {
    if (!examInfo || timeLeft === undefined) return;
    if (timeLeft <= 0) {
      if (timeLeft === 0) handleSubmit();
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line
  }, [timeLeft, examInfo]);

  useEffect(() => {
    if (!questions.length) return;
    const fetchAllChoices = async () => {
      const token = localStorage.getItem("token");
      const newChoices = {};
      await Promise.all(
          questions.map(async (q) => {
            try {
              const res = await axiosInstance.get(`/api/student/choices/question/${q.questionBankId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              newChoices[q.id] = res.data;
            } catch {
              newChoices[q.id] = [];
            }
          })
      );
      setChoices(newChoices);
    };
    fetchAllChoices();
  }, [questions]);

  // Lưu trạng thái vào localStorage khi thay đổi
  useEffect(() => {
    if (!examId) return;
    localStorage.setItem(`exam_${examId}_answers`, JSON.stringify(answers));
  }, [answers, examId]);

  useEffect(() => {
    if (!examId) return;
    localStorage.setItem(`exam_${examId}_sentAnswers`, JSON.stringify(sentAnswers));
  }, [sentAnswers, examId]);

  useEffect(() => {
    if (!examId) return;
    localStorage.setItem(`exam_${examId}_submissionId`, submissionId || "");
  }, [submissionId, examId]);

  useEffect(() => {
    if (!examId || timeLeft === undefined) return;
    // Lưu lại thời gian còn lại mỗi giây
    localStorage.setItem(`exam_${examId}_timeLeft`, timeLeft);
  }, [timeLeft, examId]);

  // Sửa lại để dùng submissionId
  const handleChangeAnswer = async (qid, value) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));

    if (!submissionId) {
      message.error("Chưa tạo bài làm, vui lòng thử lại!");
      return;
    }

    const token = localStorage.getItem("token");
    try {

      const question = questions.find(q => q.id === qid);
      if (question?.questionType === 2) {

        await axiosInstance.post(
            `/api/student/answers/submission/${submissionId}/question/${qid}/choices`,
            value, // value là mảng các choiceId
            { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {

        await axiosInstance.post(
            `/api/student/answers/submission/${submissionId}/question/${qid}/choice/${value}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setSentAnswers(prev => ({ ...prev, [qid]: true }));
      message.success("Đã gửi đáp án!");
    } catch (err) {
      message.error("Không thể gửi đáp án!");
    }
  };

  const handleSubmit = () => {
    clearTimeout(timerRef.current);
    // KHÔNG xóa submissionId ở đây nữa
    localStorage.removeItem(`exam_${examId}_answers`);
    localStorage.removeItem(`exam_${examId}_sentAnswers`);
    // localStorage.removeItem(`exam_${examId}_submissionId`); // <-- bỏ dòng này đi
    localStorage.removeItem(`exam_${examId}_timeLeft`);
    localStorage.removeItem(`exam_${examId}_startTime`);
    message.success("Đã nộp bài!");
    setTimeout(() => {
      navigate(`/student/question/exam/${examId}/score`);
    }, 2000);
  };

  const formatTime = (sec) => {
    if (sec === undefined) return "--:--";
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // --- Sơ đồ câu hỏi ---
  const handleScrollToQuestion = (qid) => {
    const el = document.getElementById(`question-${qid}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
      <div className="take-exam-container">
        <div className="exam-header">
          <h2>{examInfo?.title || "Đang tải đề thi..."}</h2>
          <div className="exam-timer">
            <Progress
                type="circle"
                percent={examInfo && timeLeft !== undefined ? (timeLeft / (examInfo.duration * 60)) * 100 : 100}
                format={() => formatTime(timeLeft)}
                size={80}
                strokeColor="#52c41a"
            />
          </div>
        </div>
        <div className="exam-description">{examInfo?.description}</div>

        <div className="exam-main-layout">
          {/* Sơ đồ câu hỏi bên trái */}
          <div className="question-map-sidebar">
            <div className="question-map">
              {questions.map((q, idx) => (
                  <button
                      key={q.id}
                      type="button"
                      className={`question-map-btn${sentAnswers[q.id] ? " answered" : ""}`}
                      onClick={() => handleScrollToQuestion(q.id)}
                      disabled={loading}
                      title={`Câu ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
              ))}
            </div>
          </div>
          {/* Nội dung bài thi bên phải */}
          <div className="exam-content">
            {loading || timeLeft === undefined || !submissionId ? (
                <Spin />
            ) : (
                <form className="exam-questions" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                  {questions.map((q, idx) => (
                      <div className="exam-question" key={q.id} id={`question-${q.id}`}>
                        <div className="question-title">
                          <b>Câu {idx + 1}:</b> {q.questionText}
                        </div>
                        {!choices[q.id] ? (
                            <Spin size="small" />
                        ) : (q.questionType === 2 ? (
                            <>
                              <Checkbox.Group
                                  className="vertical-group"
                                  options={choices[q.id].map(c => ({ label: c.choiceText, value: c.id }))}
                                  value={answers[q.id] || []}
                                  onChange={vals => setAnswers(prev => ({ ...prev, [q.id]: vals }))}
                                  disabled={timeLeft === 0}
                              />
                              <Button
                                  className={`submit-answer-btn${sentAnswers[q.id] ? " sent" : ""}`}
                                  size="small"
                                  onClick={() => handleChangeAnswer(q.id, answers[q.id] || [])}
                                  disabled={
                                      timeLeft === 0 ||
                                      !(answers[q.id] && answers[q.id].length > 0)
                                  }
                              >
                                Gửi đáp án
                              </Button>
                            </>
                        ) : (
                            <>
                              <Radio.Group
                                  className="vertical-group"
                                  options={choices[q.id].map(c => ({ label: c.choiceText, value: c.id }))}
                                  value={answers[q.id]}
                                  onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                  disabled={timeLeft === 0}
                              />
                              <Button
                                  className={`submit-answer-btn${sentAnswers[q.id] ? " sent" : ""}`}
                                  size="small"
                                  onClick={() => handleChangeAnswer(q.id, answers[q.id])}
                                  disabled={
                                      timeLeft === 0 ||
                                      answers[q.id] === undefined
                                  }
                              >
                                Gửi đáp án
                              </Button>
                            </>
                        ))}
                      </div>
                  ))}
                  <Button
                      type="primary"
                      htmlType="submit"
                      onClick={handleSubmit}
                      disabled={timeLeft === 0}
                      style={{ marginTop: 24 }}
                  >
                    Nộp bài
                  </Button>
                </form>
            )}
          </div>
        </div>
      </div>
  );
};

export default HsTakeExamPage;