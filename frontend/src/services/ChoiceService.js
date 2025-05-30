import axiosInstance from "./axiosInstance";

// Choice Services
export const createChoice = async (questionBankId, data) => {
    const response = await axiosInstance.post(`/api/teacher/choices/question/${questionBankId}`, data);
    return response.data;
};

export const updateChoice = async (id, data) => {
    const response = await axiosInstance.put(`/api/teacher/choices/${id}`, data);
    return response.data;
};

export const deleteChoice = async (id) => {
    const response = await axiosInstance.delete(`/api/teacher/choices/${id}`);
    return response.data;
};

export const getChoicesByQuestion = async (questionBankId) => {
    const response = await axiosInstance.get(`/api/teacher/choices/question/${questionBankId}`);
    return response.data;
}; 