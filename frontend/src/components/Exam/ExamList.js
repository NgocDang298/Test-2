import React, { useState, useEffect } from 'react';
import { List, Card, Select } from 'antd';
import { getExams } from '../../api/exam';

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchExams();
  }, [filter]);

  const fetchExams = async () => {
    const data = await getExams({ filter });
    setExams(data);
  };

  return (
    <div>
      <Select defaultValue="all" onChange={setFilter}>
        <Select.Option value="all">Tất cả</Select.Option>
        <Select.Option value="done">Đã thi</Select.Option>
        <Select.Option value="pending">Chưa thi</Select.Option>
      </Select>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={exams}
        renderItem={(exam) => (
          <List.Item>
            <Card title={exam.name}>
              <p>Số câu hỏi: {exam.questionCount}</p>
              <p>Thời gian: {exam.duration} phút</p>
              <Button href={`/exam/${exam.id}`}>Xem chi tiết</Button>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ExamList;