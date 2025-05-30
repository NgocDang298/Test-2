import axiosInstance from "./axiosInstance";

// Teacher Exam Services
export const createExam = async (data) => {
    const response = await axiosInstance.post('/api/teacher/exams', data);
    return response.data;
};

export const updateExam = async (id, data) => {
    const response = await axiosInstance.put(`/api/teacher/exams/${id}`, data);
    return response.data;
};

export const deleteExam = async (id) => {
    const response = await axiosInstance.delete(`/api/teacher/exams/${id}`);
    return response.data;
};

export const getExamById = async (id) => {
    const response = await axiosInstance.get(`/api/teacher/exams/${id}`);
    return response.data;
};

export const getExamsBySubject = async (subjectId) => {
    const response = await axiosInstance.get(`/api/teacher/exams/subject/${subjectId}`);
    return response.data;
}; 