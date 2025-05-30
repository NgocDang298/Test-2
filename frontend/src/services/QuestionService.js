import axiosInstance from "./axiosInstance";

// Question Bank Services
export const createQuestion = async (data) => {
    const response = await axiosInstance.post('/api/teacher/question-bank', data);
    return response.data;
};

export const updateQuestion = async (id, data) => {
    const response = await axiosInstance.put(`/api/teacher/question-bank/${id}`, data);
    return response.data;
};

export const deleteQuestion = async (id) => {
    const response = await axiosInstance.delete(`/api/teacher/question-bank/${id}`);
    return response.data;
};

export const getQuestionById = async (id) => {
    const response = await axiosInstance.get(`/api/teacher/question-bank/${id}`);
    return response.data;
};

export const getQuestionsBySubject = async (subjectId) => {
    const response = await axiosInstance.get(`/api/teacher/question-bank/subject/${subjectId}`);
    return response.data;
};

// Import/Export Functions
export const importQuestionsFromFile = async (file, subjectId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subjectId', subjectId);
    
    const response = await axiosInstance.post('/api/teacher/question-bank/import', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const exportQuestionsToFile = async (subjectId, format = 'json') => {
    const response = await axiosInstance.get(`/api/teacher/question-bank/export/subject/${subjectId}?format=${format}`, {
        responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `questions_${subjectId}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return response.data;
};

// Question in Exam Services
export const addQuestionToExam = async (examId, questionBankId) => {
    const response = await axiosInstance.post(`/api/teacher/questions/exam/${examId}/question-bank/${questionBankId}`);
    return response.data;
};

export const removeQuestionFromExam = async (examId, questionId) => {
    const response = await axiosInstance.delete(`/api/teacher/questions/exam/${examId}/question/${questionId}`);
    return response.data;
};

export const getQuestionsByExam = async (examId) => {
    const response = await axiosInstance.get(`/api/teacher/questions/exam/${examId}`);
    return response.data;
};

export const autoGenerateExam = async (examId, numberOfQuestions = 10) => {
    const response = await axiosInstance.post(`/api/teacher/questions/exam/${examId}/auto-generate?numberOfQuestions=${numberOfQuestions}`);
    return response.data;
};

export const autoGenerateExamWithDifficulty = async (examId, difficultyMap) => {
    const response = await axiosInstance.post(`/api/teacher/questions/exam/${examId}/auto-generate/by-difficulty`, difficultyMap);
    return response.data;
};

// Student Services
export const getQuestionsByExamForStudent = async (examId) => {
    const response = await axiosInstance.get(`/api/student/questions/exam/${examId}`);
    return response.data;
}; 