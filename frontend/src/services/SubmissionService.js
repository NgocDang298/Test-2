import axiosInstance from "./axiosInstance";

// Submission Services
export const createSubmission = async (examId) => {
    const response = await axiosInstance.post(`/api/student/submissions/exam/${examId}`);
    return response.data;
};

export const submitSubmission = async (submissionId) => {
    const response = await axiosInstance.post(`/api/student/submissions/${submissionId}/submit`);
    return response.data;
};

export const getSubmissionById = async (id) => {
    const response = await axiosInstance.get(`/api/teacher/submissions/${id}`);
    return response.data;
};

export const getSubmissionsByExam = async (examId) => {
    const response = await axiosInstance.get(`/api/teacher/submissions/exam/${examId}`);
    return response.data;
};

// Answer Services
export const createAnswer = async (submissionId, questionId, choiceId) => {
    const response = await axiosInstance.post(`/api/student/answers/submission/${submissionId}/question/${questionId}/choice/${choiceId}`);
    return response.data;
};

// Essay Answer Services
export const createEssayAnswer = async (submissionId, questionId, answerText) => {
    const response = await axiosInstance.post(`/api/essay-answers/submission/${submissionId}/question/${questionId}`, answerText, {
        headers: {
            'Content-Type': 'text/plain',
            'X-User-Role': 'STUDENT'
        }
    });
    return response.data;
};

// Grading Services
export const gradeSubmission = async (submissionId) => {
    const response = await axiosInstance.post(`/api/grading/submission/${submissionId}`);
    return response.data;
};

export const gradeEssayAnswer = async (essayAnswerId, score) => {
    const response = await axiosInstance.post(`/api/grading/essay-answer/${essayAnswerId}/score/${score}`, null, {
        headers: {
            'X-User-Role': 'TEACHER'
        }
    });
    return response.data;
}; 