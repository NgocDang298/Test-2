import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SubjectManager.css';
const SubjectManager = () => {
  // State quản lý danh sách môn học
  const [subjects, setSubjects] = useState([]);
  // State cho form thêm/sửa môn học
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: ''
  });
  // State kiểm soát trạng thái loading
  const [loading, setLoading] = useState(true);
  // State kiểm soát chế độ chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);

  // Lấy danh sách môn học từ backend khi component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSubjects([
        {
          id: 1,
          name: 'Toán học',
          description: 'Môn học về số học và hình học',
          totalExams: 15
        },
        {
          id: 2,
          name: 'Vật lý',
          description: 'Môn học về các hiện tượng tự nhiên',
          totalExams: 10
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Xử lý thay đổi input trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Thêm hoặc sửa môn học
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        // Cập nhật môn học
        const response = await axios.put(`/api/subjects/${formData.id}`, formData);
        setSubjects(subjects.map(subject =>
          subject.id === formData.id ? response.data : subject
        ));
      } else {
        // Thêm môn học mới
        const response = await axios.post('/api/subjects', formData);
        setSubjects([...subjects, response.data]);
      }
      // Reset form sau khi thêm/sửa
      resetForm();
    } catch (error) {
      console.error('Error saving subject:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xóa môn học
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/subjects/${id}`);
      setSubjects(subjects.filter(subject => subject.id !== id));
    } catch (error) {
      console.error('Error deleting subject:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chuyển sang chế độ chỉnh sửa
  const handleEdit = (subject) => {
    setFormData(subject);
    setIsEditing(true);
  };

  // Reset form về trạng thái ban đầu
  const resetForm = () => {
    setFormData({ id: null, name: '', description: '' });
    setIsEditing(false);
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="subject-manager">
      <h2>Quản lý môn học</h2>

      {/* Form thêm/sửa môn học */}
      <form onSubmit={handleSubmit} className="subject-form">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Tên môn học"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Mô tả môn học"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Đang xử lý...' : isEditing ? 'Cập nhật' : 'Thêm môn học'}
        </button>
        {isEditing && (
          <button type="button" onClick={resetForm} disabled={loading}>
            Hủy
          </button>
        )}
      </form>

      {/* Danh sách môn học */}
      <div className="subject-list">
        {subjects.map(subject => (
          <div key={subject.id} className="subject-card">
            <h3>{subject.name}</h3>
            <p>Mô tả: {subject.description}</p>
            <p>Số bài thi: {subject.totalExams}</p>
            <div className="subject-actions">
              <button onClick={() => handleEdit(subject)} disabled={loading}>
                Sửa
              </button>
              <button onClick={() => handleDelete(subject.id)} disabled={loading}>
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectManager;