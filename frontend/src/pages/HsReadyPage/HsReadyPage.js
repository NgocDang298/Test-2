import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from "../../services/axiosInstance";
import './HsReadyPage.css';
import { Table, Spin } from 'antd'; // Thêm dòng này

const HsReadyPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const examInfo = location.state?.examInfo;

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [localStartTime, setLocalStartTime] = useState(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            if (!examInfo?.id) return;
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await axiosInstance.get(
                    `api/student/submissions/exam/${examInfo.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                setSubmissions(res.data);
            } catch {
                setSubmissions([]);
            }
            setLoading(false);
        };
        fetchSubmissions();
    }, [examInfo]);

    const handleStart = () => {
        if (examInfo) {
            const now = new Date();
            setLocalStartTime(now);
            navigate(`/student/question/exam/${examInfo.id}`, { state: { examInfo, startTime: now.toISOString() } });
        }
    };

    // Định nghĩa các cột cho bảng antd
    const columns = [
        {
            title: 'Lần',
            dataIndex: 'index',
            key: 'index',
            render: (_, __, idx) => idx + 1,
            width: 80,
        },
        {
            title: 'Ngày làm',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (startTime) =>
                startTime ? new Date(startTime).toLocaleString('vi-VN') : '-',
        },
        {
            title: 'Điểm',
            dataIndex: 'score',
            key: 'score',
            render: (score) => score ?? '-',
            width: 100,
        },

    ];
// return
    return (
        <>
            <div className="hs-ready-container">
                <h1 className="hs-ready-title">Chuẩn bị làm bài thi</h1>
                {examInfo && (
                    <div className="hs-ready-info">
                        <p><b>Tên đề thi:</b> {examInfo.title}</p>
                        <p><b>Mô tả:</b> {examInfo.description}</p>
                        <p><b>Thời gian:</b> {examInfo.duration} phút</p>
                        {localStartTime && (
                            <p>
                                <b>Giờ bắt đầu trên máy:</b> {localStartTime.toLocaleString('vi-VN')}
                            </p>
                        )}
                    </div>
                )}
                <button className="hs-ready-btn" onClick={handleStart}>Bắt đầu làm bài</button>
            </div>

            <div className="hs-history-table-wrap">
                <h2 className="hs-history-title">Thành tích các lần làm trước</h2>
                {loading ? (
                    <Spin />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={submissions.map((s, idx) => ({ ...s, key: s.id || idx }))}
                        pagination={{ pageSize: 5, showSizeChanger: false }}
                        locale={{ emptyText: "Bạn chưa có thành tích trước đây" }}
                        size="middle"
                    />
                )}
            </div>
        </>
    );
};

export default HsReadyPage;