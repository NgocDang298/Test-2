import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, Spin, Button, Descriptions, Result } from "antd";
import axiosInstance from "../../services/axiosInstance";
import "./HsTakeScorePage.css";

const HsTakeScorePage = () => {
    const { examId, subjectId: paramSubjectId } = useParams();

    const location = useLocation();

    const subjectId = paramSubjectId || location.state?.subjectId;
    const [scoreInfo, setScoreInfo] = useState(null);
    
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    // Lấy submissionId từ localStorage (vì vừa nộp xong)
    const submissionId = localStorage.getItem(`exam_${examId}_submissionId`);

    useEffect(() => {
        const fetchScore = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const res = await axiosInstance.post(
                    `/api/student/submissions/${submissionId}/submit`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setScoreInfo(res.data);
            } catch {
                setScoreInfo(null);
            } finally {
                setLoading(false);
            }
        };
        if (submissionId) fetchScore();
        else setLoading(false);
    }, [submissionId]);

    if (loading) return <Spin style={{ marginTop: 60 }} />;

    if (!scoreInfo)
        return (
            <Result
                status="error"
                title="Không thể lấy kết quả bài thi"
                extra={[
                    <Button type="primary" onClick={() => navigate(`/student`)}>Về trang chủ</Button>
                ]}
            />
        );
        
    return (
        <div className="score-page-container">
            <Card
                className="score-card"
                style={{ maxWidth: 500, margin: "40px auto", textAlign: "center" }}
                hoverable
            >
                <Result
                    icon={
                        <img
                            src="/images/success.png"
                            alt="success"
                            style={{ width: 80, marginBottom: 16 }}
                        />
                    }
                    status="success"
                    title={<span style={{ fontWeight: 700, fontSize: 22 }}>Bạn đã hoàn thành "{scoreInfo.exam.title}"</span>}
                    subTitle={
                        <span style={{ fontSize: 28, color: "#52c41a", fontWeight: 700 }}>
                            Điểm số: {scoreInfo.score}
                        </span>
                    }
                />
                <Descriptions column={1} bordered size="small" className="score-desc">
                    <Descriptions.Item label="Mô tả">{scoreInfo.exam.description}</Descriptions.Item>
                    <Descriptions.Item label="Thời gian làm bài">
                        {scoreInfo.exam.duration} phút
                    </Descriptions.Item>
                    <Descriptions.Item label="Thời gian nộp bài">
                        {new Date().toLocaleString("vi-VN")}
                    </Descriptions.Item>
                </Descriptions>
                <Button
                    type="primary"
                    style={{ marginTop: 24, width: "100%", fontWeight: 600, fontSize: 18, background: "#52c41a", borderColor: "#52c41a" }}
                    onClick={() => navigate(`/student`)}
                    size="large"
                >
                    Về trang chủ
                </Button>
            </Card>
        </div>
    );
};

export default HsTakeScorePage;