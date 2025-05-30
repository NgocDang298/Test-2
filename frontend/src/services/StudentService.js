import axiosInstance from "./axiosInstance";

// Student Services
export const updateStudentInfo = async (data) => {
    const response = await axiosInstance.put('/api/student/update-info', data);
    return response.data;
};

export const changePassword = async (data) => {
    const response = await axiosInstance.put('/api/auth/change-password', data);
    return response.data;
}; 