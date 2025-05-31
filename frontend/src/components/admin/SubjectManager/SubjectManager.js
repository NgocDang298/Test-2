import {
  BarChartOutlined,
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  List,
  Modal,
  Row,
  Spin,
  Statistic,
  Tag,
  Typography
} from 'antd';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchListUsers } from '../../../services/AdminService';
import {
  addStudentToSubjectByAdmin,
  approveSubject,
  assignTeacherToSubject,
  createSubjectByAdmin,
  deleteSubject,
  getAllSubjects,
  getPendingSubjects,
  getStudentsInSubjectByAdmin,
  getTeachersForSubject,
  rejectSubject,
  removeStudentFromSubject,
  removeTeacherFromSubject,
  updateSubjectByAdmin
} from '../../../services/SubjectService';
import SearchComponent from '../SearchComponent/SearchComponent';
import './SubjectManager.css';

const { TextArea } = Input;
const { Text } = Typography;

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
  const [searchTerm, setSearchTerm] = useState('');
  
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
  const [teacherLoading, setTeacherLoading] = useState(false);
  const [studentLoading, setStudentLoading] = useState(false);
  const [assigningTeacher, setAssigningTeacher] = useState(null);
  const [removingTeacher, setRemovingTeacher] = useState(null);
  const [addingStudent, setAddingStudent] = useState(null);
  const [removingStudent, setRemovingStudent] = useState(null);

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

  const handleSearch = (searchTerm, searchBy) => {
    setSearchTerm(searchTerm);
    
    if (!searchTerm.trim()) {
      setSearchResults([]);
      toast.info('Đã xóa kết quả tìm kiếm');
      return;
    }

    const filteredSubjects = allSubjects.filter(subject => 
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (subject.description && subject.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // Thêm status cho search results
    const subjectsWithStatus = filteredSubjects.map(subject => getSubjectWithStatus(subject));
    
    setSearchResults(subjectsWithStatus);
    toast.success(`Tìm thấy ${filteredSubjects.length} môn học`);
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
    setTeacherLoading(true);
    try {
      const response = await getTeachersForSubject(subject.id);
      setSubjectTeachers(response);
      setShowTeacherModal(true);
    } catch (err) {
      toast.error('Không thể tải danh sách giáo viên.');
    } finally {
      setTeacherLoading(false);
    }
  };

  const handleAssignTeacher = async (teacherId) => {
    setAssigningTeacher(teacherId);
    try {
      await assignTeacherToSubject(selectedSubject.id, teacherId);
      const response = await getTeachersForSubject(selectedSubject.id);
      setSubjectTeachers(response);
      toast.success('Gán giáo viên thành công!');
    } catch (err) {
      toast.error('Có lỗi xảy ra khi gán giáo viên.');
    } finally {
      setAssigningTeacher(null);
    }
  };

  const handleRemoveTeacher = async (teacherId) => {
    setRemovingTeacher(teacherId);
    try {
      await removeTeacherFromSubject(selectedSubject.id, teacherId);
      const response = await getTeachersForSubject(selectedSubject.id);
      setSubjectTeachers(response);
      toast.success('Gỡ giáo viên thành công!');
    } catch (err) {
      toast.error('Có lỗi xảy ra khi gỡ giáo viên.');
    } finally {
      setRemovingTeacher(null);
    }
  };

  const handleManageStudents = async (subject) => {
    setSelectedSubject(subject);
    setStudentLoading(true);
    try {
      const response = await getStudentsInSubjectByAdmin(subject.id);
      setSubjectStudents(response);
      setShowStudentModal(true);
    } catch (err) {
      toast.error('Không thể tải danh sách học sinh.');
    } finally {
      setStudentLoading(false);
    }
  };

  const handleAddStudent = async (studentId) => {
    setAddingStudent(studentId);
    try {
      await addStudentToSubjectByAdmin(selectedSubject.id, studentId);
      const response = await getStudentsInSubjectByAdmin(selectedSubject.id);
      setSubjectStudents(response);
      toast.success('Thêm học sinh thành công!');
    } catch (err) {
      toast.error('Có lỗi xảy ra khi thêm học sinh.');
    } finally {
      setAddingStudent(null);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    setRemovingStudent(studentId);
    try {
      await removeStudentFromSubject(selectedSubject.id, studentId);
      const response = await getStudentsInSubjectByAdmin(selectedSubject.id);
      setSubjectStudents(response);
      toast.success('Gỡ học sinh thành công!');
    } catch (err) {
      toast.error('Có lỗi xảy ra khi gỡ học sinh.');
    } finally {
      setRemovingStudent(null);
    }
  };

  const getSubjectWithStatus = (subject) => {
    // Kiểm tra xem môn học có trong danh sách pending không
    const pendingSubject = pendingSubjects.find(p => p.id === subject.id);
    if (pendingSubject) {
      return { ...subject, status: 0 }; // Chờ duyệt
    }
    
    // Nếu không có trong pending, coi như đã được duyệt
    return { ...subject, status: 1 }; // Đã duyệt
  };

  const getFilteredSubjects = () => {
    let subjects = searchTerm.trim() ? searchResults : allSubjects;
    
    // Thêm status cho từng môn học
    subjects = subjects.map(subject => getSubjectWithStatus(subject));
    
    if (statusFilter === 'approved') {
      subjects = subjects.filter(subject => subject.status === 1);
    } else if (statusFilter === 'pending') {
      subjects = subjects.filter(subject => subject.status === 0);
    }
    
    return subjects;
  };

  const handleViewDetail = async (subject) => {
    // Đảm bảo subject có status đúng
    const subjectWithStatus = getSubjectWithStatus(subject);
    setSelectedSubject(subjectWithStatus);
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
        createdAt: subject.created_at || 'Không xác định'
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

  const handleCloseTeacherModal = () => {
    setShowTeacherModal(false);
    setTeacherLoading(false);
    setAssigningTeacher(null);
    setRemovingTeacher(null);
  };

  const handleCloseStudentModal = () => {
    setShowStudentModal(false);
    setStudentLoading(false);
    setAddingStudent(null);
    setRemovingStudent(null);
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
          <option value="pending">Chờ duyệt</option>
        </select>
      </div>
      
      <div className="subjects-grid">
        {getFilteredSubjects().length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-search"></i>
            <p>
              {searchTerm.trim() 
                ? `Không tìm thấy môn học nào với từ khóa "${searchTerm}"` 
                : 'Không có môn học nào'
              }
            </p>
          </div>
        ) : (
          getFilteredSubjects().map(subject => (
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
          ))
        )}
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
            onClick={() => {
              setActiveTab('pending');
              setSearchTerm('');
              setSearchResults([]);
            }}
          >
            Chờ duyệt ({pendingSubjects.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('all');
              setSearchTerm('');
              setSearchResults([]);
            }}
          >
            Tất cả môn học
          </button>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'pending' ? renderPendingSubjects() : renderAllSubjects()}
      </div>

      {/* Create Subject Modal */}
      <Modal
        title="Tạo môn học mới"
        open={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        footer={null}
        width={600}
      >
        <Form
          layout="vertical"
          onFinish={handleCreateSubject}
          initialValues={formData}
        >
          <Form.Item
            label="Tên môn học"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}
          >
            <Input
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Nhập tên môn học"
            />
          </Form.Item>
          
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <TextArea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Nhập mô tả môn học"
            />
          </Form.Item>
          
          <Form.Item className="modal-actions">
            <Button onClick={() => setShowCreateModal(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
              Tạo môn học
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Subject Modal */}
      <Modal
        title="Chỉnh sửa môn học"
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        footer={null}
        width={600}
      >
        <Form
          layout="vertical"
          onFinish={handleUpdateSubject}
          initialValues={formData}
        >
          <Form.Item
            label="Tên môn học"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}
          >
            <Input
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Nhập tên môn học"
            />
          </Form.Item>
          
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <TextArea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Nhập mô tả môn học"
            />
          </Form.Item>
          
          <Form.Item className="modal-actions">
            <Button onClick={() => setShowEditModal(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" icon={<EditOutlined />}>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Teacher Management Modal */}
      <Modal
        title={`Quản lý giáo viên - ${selectedSubject?.name}`}
        open={showTeacherModal}
        onCancel={handleCloseTeacherModal}
        footer={null}
        width={800}
      >
        <Spin spinning={teacherLoading} tip="Đang tải danh sách giáo viên...">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card title={`Giáo viên đã gán (${subjectTeachers.length})`} size="small">
                <List
                  dataSource={subjectTeachers}
                  renderItem={(teacher) => (
                    <List.Item
                      actions={[
                        <Button
                          type="primary"
                          danger
                          size="small"
                          loading={removingTeacher === teacher.id}
                          onClick={() => handleRemoveTeacher(teacher.id)}
                          icon={<CloseOutlined />}
                        >
                          Gỡ
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={teacher.fullname}
                        description={teacher.email}
                      />
                    </List.Item>
                  )}
                  locale={{ emptyText: 'Chưa có giáo viên nào được gán' }}
                />
              </Card>
            </Col>
            
            <Col span={12}>
              <Card title="Gán giáo viên mới" size="small">
                <List
                  dataSource={teachers.filter(teacher => 
                    !subjectTeachers.some(st => st.id === teacher.id)
                  )}
                  renderItem={(teacher) => (
                    <List.Item
                      actions={[
                        <Button
                          type="primary"
                          size="small"
                          loading={assigningTeacher === teacher.id}
                          onClick={() => handleAssignTeacher(teacher.id)}
                          icon={<CheckOutlined />}
                        >
                          Gán
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={teacher.fullname}
                        description={teacher.email}
                      />
                    </List.Item>
                  )}
                  locale={{ emptyText: 'Không có giáo viên nào để gán' }}
                />
              </Card>
            </Col>
          </Row>
        </Spin>
      </Modal>

      {/* Student Management Modal */}
      <Modal
        title={`Quản lý học sinh - ${selectedSubject?.name}`}
        open={showStudentModal}
        onCancel={handleCloseStudentModal}
        footer={null}
        width={800}
      >
        <Spin spinning={studentLoading} tip="Đang tải danh sách học sinh...">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card title={`Học sinh đã gán (${subjectStudents.length})`} size="small">
                <List
                  dataSource={subjectStudents}
                  renderItem={(student) => (
                    <List.Item
                      actions={[
                        <Button
                          type="primary"
                          danger
                          size="small"
                          loading={removingStudent === student.id}
                          onClick={() => handleRemoveStudent(student.id)}
                          icon={<CloseOutlined />}
                        >
                          Gỡ
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={student.fullname}
                        description={student.email}
                      />
                    </List.Item>
                  )}
                  locale={{ emptyText: 'Chưa có học sinh nào được gán' }}
                />
              </Card>
            </Col>
            
            <Col span={12}>
              <Card title="Thêm học sinh mới" size="small">
                <List
                  dataSource={students.filter(student => 
                    !subjectStudents.some(ss => ss.id === student.id)
                  )}
                  renderItem={(student) => (
                    <List.Item
                      actions={[
                        <Button
                          type="primary"
                          size="small"
                          loading={addingStudent === student.id}
                          onClick={() => handleAddStudent(student.id)}
                          icon={<CheckOutlined />}
                        >
                          Thêm
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={student.fullname}
                        description={student.email}
                      />
                    </List.Item>
                  )}
                  locale={{ emptyText: 'Không có học sinh nào để thêm' }}
                />
              </Card>
            </Col>
          </Row>
        </Spin>
      </Modal>

      {/* Subject Detail Modal */}
      <Modal
        title={`Chi tiết môn học - ${selectedSubject?.name}`}
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowDetailModal(false)}>
            Đóng
          </Button>
        ]}
        width={900}
      >
        {selectedSubject && (
          <div>
            <Descriptions title="Thông tin cơ bản" bordered column={2}>
              <Descriptions.Item label="Tên môn học" span={2}>
                {selectedSubject.name}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>
                {selectedSubject.description || 'Không có mô tả'}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={selectedSubject.status === 1 ? 'green' : selectedSubject.status === 0 ? 'orange' : 'red'}>
                  {getStatusText(selectedSubject.status)}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="Tổng số giáo viên"
                    value={subjectTeachers.length}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="Tổng số học sinh"
                    value={subjectStudents.length}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="Tỷ lệ GV/HS"
                    value={subjectStudents.length > 0 ? (subjectTeachers.length / subjectStudents.length).toFixed(2) : 0}
                    prefix={<BarChartOutlined />}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              <Col span={12}>
                <Card 
                  title={`Danh sách giáo viên (${subjectTeachers.length})`}
                  size="small"
                  extra={
                    <Button 
                      type="primary" 
                      size="small"
                      onClick={() => handleManageTeachers(selectedSubject)}
                      icon={<UserOutlined />}
                    >
                      Quản lý
                    </Button>
                  }
                >
                  <List
                    dataSource={subjectTeachers.slice(0, 5)}
                    renderItem={(teacher) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={<UserOutlined />} />}
                          title={teacher.fullname}
                          description={teacher.email}
                        />
                      </List.Item>
                    )}
                    locale={{ emptyText: 'Chưa có giáo viên nào' }}
                  />
                  {subjectTeachers.length > 5 && (
                    <div style={{ textAlign: 'center', marginTop: 8 }}>
                      <Text type="secondary">
                        Và {subjectTeachers.length - 5} giáo viên khác...
                      </Text>
                    </div>
                  )}
                </Card>
              </Col>
              
              <Col span={12}>
                <Card 
                  title={`Danh sách học sinh (${subjectStudents.length})`}
                  size="small"
                  extra={
                    <Button 
                      type="primary" 
                      size="small"
                      onClick={() => handleManageStudents(selectedSubject)}
                      icon={<TeamOutlined />}
                    >
                      Quản lý
                    </Button>
                  }
                >
                  <List
                    dataSource={subjectStudents.slice(0, 5)}
                    renderItem={(student) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={<UserOutlined />} />}
                          title={student.fullname}
                          description={student.email}
                        />
                      </List.Item>
                    )}
                    locale={{ emptyText: 'Chưa có học sinh nào' }}
                  />
                  {subjectStudents.length > 5 && (
                    <div style={{ textAlign: 'center', marginTop: 8 }}>
                      <Text type="secondary">
                        Và {subjectStudents.length - 5} học sinh khác...
                      </Text>
                    </div>
                  )}
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SubjectManager;