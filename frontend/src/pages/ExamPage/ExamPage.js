import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ExamPage = () => {
    const [exams, setExams] = useState([]);

    useEffect(() => {
        axios.get('/api/exams')
            .then(response => setExams(response.data))
            .catch(error => console.error('Error fetching exams:', error));
    }, []);

    return (
        <div className="exam-page">
            <h1>Danh sách bài thi</h1>
            <div className="exam-list">
                {exams.map(exam => (
                    <div key={exam.id} className="exam-card">
                        <h3>{exam.title}</h3>
                        <p>Môn: {exam.subject}</p>
                        <Link to={`/take-exam/${exam.id}`}>
                            <button>Thi ngay</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExamPage;