import axios from "axios";
import axiosInstance from "./axiosInstance";

const handleLogin = async (credentials) => {
    console.log("check user: ", credentials)
    const response = await axiosInstance.post('/api/auth/login', credentials);
    return response.data;
};

const handleRegister = async (data) => {
    console.log('check data', data)
    const response = await axios.post('/api/auth/register', data);
    return response.data;
};

const getUserProfile = async () => {
    const response = await axiosInstance.get('/api/user/profile');
    return response.data;
};

const updateUserProfile = async (data) => {
    const response = await axiosInstance.put('/api/user/profile', data);
    return response.data;
};

const changePassword = async (data) => {
    const response = await axiosInstance.put('/api/auth/change-password', data);
    return response.data;
};

export {
    handleLogin,
    handleRegister,
    getUserProfile,
    updateUserProfile,
    changePassword
};
