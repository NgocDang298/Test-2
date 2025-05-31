import axiosInstance from "./axiosInstance";

// Teacher Subject Services
export const createSubject = async (data) => {
    const response = await axiosInstance.post('/api/teacher/subjects', data);
    return response.data;
};

export const updateSubject = async (id, data) => {
    const response = await axiosInstance.put(`/api/teacher/subjects/${id}`, data);
    return response.data;
};

export const getSubjectById = async (id) => {
    const response = await axiosInstance.get(`/api/teacher/subjects/${id}`);
    return response.data;
};

export const getSubjectsByTeacher = async () => {
    const response = await axiosInstance.get('/api/teacher/subjects');
    return response.data;
};

export const addStudentToSubject = async (subjectId, studentId) => {
    const response = await axiosInstance.post(`/api/teacher/subjects/${subjectId}/students/${studentId}`);
    return response.data;
};

export const getStudentsInSubject = async (subjectId) => {
    const response = await axiosInstance.get(`/api/teacher/subjects/${subjectId}/students`);
    return response.data;
};

export const getSubjectsForStudent = async () => {
    const response = await axiosInstance.get('/api/student/subjects');
    return response.data;
};

// Admin Subject Services
export const getPendingSubjects = async () => {
    const response = await axiosInstance.get('/api/admin/subjects/pending');
    return response.data;
};

export const approveSubject = async (id) => {
    const response = await axiosInstance.post(`/api/admin/subjects/${id}/approve`);
    return response.data;
};

export const rejectSubject = async (id) => {
    const response = await axiosInstance.post(`/api/admin/subjects/${id}/reject`);
    return response.data;
};

export const assignTeacherToSubject = async (subjectId, teacherId) => {
    const response = await axiosInstance.post(`/api/admin/subjects/${subjectId}/assign-teacher/${teacherId}`);
    return response.data;
};

export const removeTeacherFromSubject = async (subjectId, teacherId) => {
    const response = await axiosInstance.delete(`/api/admin/subjects/${subjectId}/remove-teacher/${teacherId}`);
    return response.data;
};

export const getTeachersForSubject = async (subjectId) => {
    const response = await axiosInstance.get(`/api/admin/subjects/${subjectId}/teachers`);
    return response.data;
};

export const createSubjectByAdmin = async (data) => {
    const response = await axiosInstance.post('/api/admin/subjects', data);
    return response.data;
};

export const updateSubjectByAdmin = async (id, data) => {
    const response = await axiosInstance.put(`/api/admin/subjects/${id}`, data);
    return response.data;
};

export const deleteSubject = async (id) => {
    const response = await axiosInstance.delete(`/api/admin/subjects/${id}`);
    return response.data;
};

export const addStudentToSubjectByAdmin = async (subjectId, studentId) => {
    const response = await axiosInstance.post(`/api/admin/subjects/${subjectId}/students/${studentId}`);
    return response.data;
};

export const removeStudentFromSubject = async (subjectId, studentId) => {
    const response = await axiosInstance.delete(`/api/admin/subjects/${subjectId}/students/${studentId}`);
    return response.data;
};

export const getStudentsInSubjectByAdmin = async (subjectId) => {
    const response = await axiosInstance.get(`/api/admin/subjects/${subjectId}/students`);
    return response.data;
};

export const getAllSubjects = async () => {
    const response = await axiosInstance.get('/api/admin/subjects/all');
    return response.data;
};

export const searchSubjects = async (params) => {
    const queryParams = new URLSearchParams();
    if (params.name) queryParams.append('name', params.name);
    if (params.description) queryParams.append('description', params.description);
    
    const response = await axiosInstance.get(`/api/admin/subjects/search?${queryParams.toString()}`);
    return response.data;
}; 