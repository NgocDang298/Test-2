import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './SubjectManager.css';
import SearchComponent from '../SearchComponent/SearchComponent';
import { 
  getPendingSubjects, 
  approveSubject, 
  rejectSubject,
  createSubjectByAdmin,
  updateSubjectByAdmin,
  deleteSubject,
  assignTeacherToSubject,
  removeTeacherFromSubject,
  getTeachersForSubject,
  addStudentToSubjectByAdmin,
  removeStudentFromSubject,
  getStudentsInSubjectByAdmin,
  getAllSubjects,
  searchSubjects
} from '../../../services/SubjectService';
import { fetchListUsers } from '../../../services/AdminService';

const SubjectManager = ({ refreshStats }) => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingSubjects, setPendingSubjects] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all'); // all, approved, rejected
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectTeachers, setSubjectTeachers] = useState([]);
  const [subjectStudents, setSubjectStudents] = useState([]);
  const [subjectStats, setSubjectStats] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchPendingSubjects(),
        fetchAllSubjects(),
        fetchTeachers(),
        fetchStudents()
      ]);
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingSubjects = async () => {
    try {
      const response = await getPendingSubjects();
      setPendingSubjects(response);
    } catch (err) {
      console.error('Error fetching pending subjects:', err);
    }
  };

  const fetchAllSubjects = async () => {
    try {
      const response = await getAllSubjects();
      setAllSubjects(response);
    } catch (err) {
      console.error('Error fetching all subjects:', err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await fetchListUsers('teacher');
      setTeachers(response.data);
    } catch (err) {
      console.error('Error fetching teachers:', err);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetchListUsers('student');
      setStudents(response.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const handleSearch = async (searchTerm, searchBy) => {
    try {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      const params = {
        name: searchTerm
      };

      const results = await searchSubjects(params);
      setSearchResults(results);
      toast.success(`Tìm thấy ${results.length} môn học`);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Có lỗi xảy ra khi tìm kiếm');
      setSearchResults([]);
    }
  };

  const handleApproveSubject = async (subjectId) => {
    try {
      await approveSubject(subjectId);
      await fetchPendingSubjects();
      if (refreshStats) refreshStats();
      toast.success('Môn học đã được duyệt thành công!');
    } catch (err) {
      toast.error('Có lỗi xảy ra khi duyệt môn học.');
    }
  };

  const handleRejectSubject = async (subjectId) => {
    try {
      await rejectSubject(subjectId);
      await fetchPendingSubjects();
      if (refreshStats) refreshStats();
      toast.success('Môn học đã bị từ chối.');
    } catch (err) {
      toast.error('Có lỗi xảy ra khi từ chối môn học.');
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      await createSubjectByAdmin(formData);
      setShowCreateModal(false);
      setFormData({ name: '', description: '' });
      await fetchData();
      toast.success('Tạo môn học thành công!');
    } catch (err) {
      toast.error('Có lỗi xảy ra khi tạo môn học.');
    }
  };

  const handleUpdateSubject = async (e) => {
    e.preventDefault();
    try {
      await updateSubjectByAdmin(selectedSubject.id, formData);
      setShowEditModal(false);
      setFormData({ name: '', description: '' });
      setSelectedSubject(null);
      await fetchData();
      toast.success('Cập nhật môn học thành công!');
    } catch (err) {
      toast.error('Có lỗi xảy ra khi cập nhật môn học.');
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa môn học này?')) {
      try {
        await deleteSubject(subjectId);
        await fetchData();
        toast.success('Xóa môn học thành công!');
      } catch (err) {
        toast.error('Có lỗi xảy ra khi xóa môn học.');
      }
    }
  };

  const handleManageTeachers = async (subject) => {
    setSelectedSubject(subject);
    try {
      const response = await getTeachersForSubject(subject.id);
      setSubjectTeachers(response);
      setShowTeacherModal(true);
    } catch (err) {
      toast.error('Không thể tải danh sách giáo viên.');
    }
  };

  const handleAssignTeacher = async (teacherId) => {
    try {
      await assignTeacherToSubject(selectedSubject.id, teacherId);
      const response = await getTeachersForSubject(selectedSubject.id);
      setSubjectTeachers(response);
      toast.success('Gán giáo viên thành công!');
    } catch (err) {
      toast.error('Có lỗi xảy ra khi gán giáo viên.');
    }
  };

  const handleRemoveTeacher = async (teacherId) => {
    try {
      await removeTeacherFromSubject(selectedSubject.id, teacherId);
      const response = await getTeachersForSubject(selectedSubject.id);
      setSubjectTeachers(response);
      toast.success('Gỡ giáo viên thành công!');
    } catch (err) {
      toast.error('Có lỗi xảy ra khi gỡ giáo viên.');
    }
  };

  const handleManageStudents = async (subject) => {
    setSelectedSubject(subject);
    try {
      const response = await getStudentsInSubjectByAdmin(subject.id);
      setSubjectStudents(response);
      setShowStudentModal(true);
    } catch (err) {
      toast.error('Không thể tải danh sách học sinh.');
    }
  };

  const handleAddStudent = async (studentId) => {
    try {
      await addStudentToSubjectByAdmin(selectedSubject.id, studentId);
      const response = await getStudentsInSubjectByAdmin(selectedSubject.id);
      setSubjectStudents(response);
      toast.success('Thêm học sinh thành công!');
    } catch (err) {
      toast.error('Có lỗi xảy ra khi thêm học sinh.');
    }
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      await removeStudentFromSubject(selectedSubject.id, studentId);
      const response = await getStudentsInSubjectByAdmin(selectedSubject.id);
      setSubjectStudents(response);
      toast.success('Gỡ học sinh thành công!');
    } catch (err) {
      toast.error('Có lỗi xảy ra khi gỡ học sinh.');
    }
  };

  const getFilteredSubjects = () => {
    let subjects = searchResults.length > 0 ? searchResults : allSubjects;
    
    if (statusFilter === 'approved') {
      subjects = subjects.filter(subject => subject.status === 1);
    } else if (statusFilter === 'rejected') {
      subjects = subjects.filter(subject => subject.status === 2);
    }
    
    return subjects;
  };

  const handleViewDetail = async (subject) => {
    setSelectedSubject(subject);
    try {
      const [teachersResponse, studentsResponse] = await Promise.all([
        getTeachersForSubject(subject.id),
        getStudentsInSubjectByAdmin(subject.id)
      ]);
      
      setSubjectTeachers(teachersResponse);
      setSubjectStudents(studentsResponse);
      setSubjectStats({
        teacherCount: teachersResponse.length,
        studentCount: studentsResponse.length,
        createdAt: subject.createdAt || 'Không xác định'
      });
      setShowDetailModal(true);
    } catch (err) {
      toast.error('Không thể tải thông tin chi tiết môn học.');
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0: return 'Chờ duyệt';
      case 1: return 'Đã duyệt';
      case 2: return 'Từ chối';
      default: return 'Không xác định';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 0: return 'pending';
      case 1: return 'approved';
      case 2: return 'rejected';
      default: return 'unknown';
    }
  };

  const renderPendingSubjects = () => (
    <div className="pending-subjects">
      <h3>Môn học chờ duyệt ({pendingSubjects.length})</h3>
      {pendingSubjects.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-check-circle"></i>
          <p>Không có môn học nào chờ duyệt</p>
        </div>
      ) : (
        <div className="subjects-grid">
          {pendingSubjects.map(subject => (
            <div key={subject.id} className="subject-card pending">
              <div className="subject-header">
                <h4>{subject.name}</h4>
                <span className="status-badge pending">Chờ duyệt</span>
              </div>
              <p className="subject-description">{subject.description}</p>
              <div className="subject-actions">
                <button 
                  className="btn btn-success"
                  onClick={() => handleApproveSubject(subject.id)}
                >
                  <i className="fas fa-check"></i> Duyệt
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleRejectSubject(subject.id)}
                >
                  <i className="fas fa-times"></i> Từ chối
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAllSubjects = () => (
    <div className="all-subjects">
      <div className="section-header">
        <h3>Tất cả môn học</h3>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <i className="fas fa-plus"></i> Tạo môn học mới
        </button>
      </div>
      
      <SearchComponent
        onSearch={handleSearch}
        placeholder="Tìm kiếm môn học..."
        searchType="subjects"
      />
      
      <div className="filter-section">
        <label htmlFor="statusFilter">Lọc theo trạng thái:</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="all">Tất cả</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Từ chối</option>
        </select>
      </div>
      
      <div className="subjects-grid">
        {getFilteredSubjects().map(subject => (
          <div key={subject.id} className="subject-card">
            <div className="subject-header">
              <h4>{subject.name}</h4>
              <span className={`status-badge ${getStatusClass(subject.status)}`}>
                {getStatusText(subject.status)}
              </span>
            </div>
            <p className="subject-description">{subject.description}</p>
            <div className="subject-actions">
              <button 
                className="btn btn-info"
                onClick={() => handleViewDetail(subject)}
              >
                <i className="fas fa-eye"></i> Chi tiết
              </button>
              <button 
                className="btn btn-info"
                onClick={() => handleManageTeachers(subject)}
              >
                <i className="fas fa-users"></i> Giáo viên
              </button>
              <button 
                className="btn btn-info"
                onClick={() => handleManageStudents(subject)}
              >
                <i className="fas fa-user-graduate"></i> Học sinh
              </button>
              <button 
                className="btn btn-warning"
                onClick={() => {
                  setSelectedSubject(subject);
                  setFormData({ name: subject.name, description: subject.description });
                  setShowEditModal(true);
                }}
              >
                <i className="fas fa-edit"></i> Sửa
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => handleDeleteSubject(subject.id)}
              >
                <i className="fas fa-trash"></i> Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-triangle"></i>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchData}>
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="subject-manager">
      <div className="manager-header">
        <h2>Quản lý môn học</h2>
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Chờ duyệt ({pendingSubjects.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Tất cả môn học
          </button>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'pending' ? renderPendingSubjects() : renderAllSubjects()}
      </div>

      {/* Create Subject Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Tạo môn học mới</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleCreateSubject}>
              <div className="form-group">
                <label>Tên môn học</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="4"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  Tạo môn học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Subject Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Chỉnh sửa môn học</h3>
              <button 
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleUpdateSubject}>
              <div className="form-group">
                <label>Tên môn học</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="4"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Management Modal */}
      {showTeacherModal && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h3>Quản lý giáo viên - {selectedSubject?.name}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowTeacherModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="assigned-teachers">
                <h4>Giáo viên đã gán ({subjectTeachers.length})</h4>
                <div className="user-list">
                  {subjectTeachers.map(teacher => (
                    <div key={teacher.id} className="user-item">
                      <div className="user-info">
                        <strong>{teacher.fullname}</strong>
                        <span>{teacher.email}</span>
                      </div>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveTeacher(teacher.id)}
                      >
                        Gỡ
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="available-teachers">
                <h4>Gán giáo viên mới</h4>
                <div className="user-list">
                  {teachers.filter(teacher => 
                    !subjectTeachers.some(st => st.id === teacher.id)
                  ).map(teacher => (
                    <div key={teacher.id} className="user-item">
                      <div className="user-info">
                        <strong>{teacher.fullname}</strong>
                        <span>{teacher.email}</span>
                      </div>
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => handleAssignTeacher(teacher.id)}
                      >
                        Gán
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Management Modal */}
      {showStudentModal && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h3>Quản lý học sinh - {selectedSubject?.name}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowStudentModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="assigned-students">
                <h4>Học sinh đã thêm ({subjectStudents.length})</h4>
                <div className="user-list">
                  {subjectStudents.map(student => (
                    <div key={student.id} className="user-item">
                      <div className="user-info">
                        <strong>{student.fullname}</strong>
                        <span>{student.email}</span>
                      </div>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveStudent(student.id)}
                      >
                        Gỡ
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="available-students">
                <h4>Thêm học sinh mới</h4>
                <div className="user-list">
                  {students.filter(student => 
                    !subjectStudents.some(ss => ss.id === student.id)
                  ).map(student => (
                    <div key={student.id} className="user-item">
                      <div className="user-info">
                        <strong>{student.fullname}</strong>
                        <span>{student.email}</span>
                      </div>
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => handleAddStudent(student.id)}
                      >
                        Thêm
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subject Detail Modal */}
      {showDetailModal && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h3>Chi tiết môn học - {selectedSubject?.name}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowDetailModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="subject-detail-info">
                <div className="detail-section">
                  <h4><i className="fas fa-info-circle"></i> Thông tin cơ bản</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Tên môn học:</label>
                      <span>{selectedSubject?.name}</span>
                    </div>
                    <div className="detail-item">
                      <label>Mô tả:</label>
                      <span>{selectedSubject?.description || 'Không có mô tả'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Trạng thái:</label>
                      <span className={`status-badge ${getStatusClass(selectedSubject?.status)}`}>
                        {getStatusText(selectedSubject?.status)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Ngày tạo:</label>
                      <span>{subjectStats.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4><i className="fas fa-chart-bar"></i> Thống kê</h4>
                  <div className="stats-row">
                    <div className="stat-item">
                      <div className="stat-number">{subjectStats.teacherCount || 0}</div>
                      <div className="stat-label">Giáo viên</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">{subjectStats.studentCount || 0}</div>
                      <div className="stat-label">Học sinh</div>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4><i className="fas fa-users"></i> Giáo viên ({subjectTeachers.length})</h4>
                  <div className="user-list compact">
                    {subjectTeachers.length > 0 ? (
                      subjectTeachers.map(teacher => (
                        <div key={teacher.id} className="user-item compact">
                          <div className="user-info">
                            <strong>{teacher.fullname}</strong>
                            <span>{teacher.email}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="empty-message">Chưa có giáo viên nào được gán</p>
                    )}
                  </div>
                </div>

                <div className="detail-section">
                  <h4><i className="fas fa-user-graduate"></i> Học sinh ({subjectStudents.length})</h4>
                  <div className="user-list compact">
                    {subjectStudents.length > 0 ? (
                      subjectStudents.slice(0, 5).map(student => (
                        <div key={student.id} className="user-item compact">
                          <div className="user-info">
                            <strong>{student.fullname}</strong>
                            <span>{student.email}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="empty-message">Chưa có học sinh nào đăng ký</p>
                    )}
                    {subjectStudents.length > 5 && (
                      <p className="more-info">... và {subjectStudents.length - 5} học sinh khác</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectManager;