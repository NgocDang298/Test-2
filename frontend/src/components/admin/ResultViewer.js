import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResultViewer = ({ match }) => {
  const [results, setResults] = useState([]);
  const questionId = match.params.id;

  useEffect(() => {
    // Gọi API để lấy kết quả bài làm
    axios.get(`/api/results/${questionId}`)
      .then(response => setResults(response.data))
      .catch(error => console.error('Error fetching results:', error));
  }, [questionId]);

  return (
    <div className="result-viewer">
      <h1>Kết quả bài làm</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên thí sinh</th>
            <th>Điểm</th>
          </tr>
        </thead>
        <tbody>
          {results.map(result => (
            <tr key={result.id}>
              <td>{result.id}</td>
              <td>{result.studentName}</td>
              <td>{result.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultViewer;