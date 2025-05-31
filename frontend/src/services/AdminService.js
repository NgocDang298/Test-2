import axiosInstance from "./axiosInstance"

// User Management
const fetchListUsers = async (role) => {
    const response = await axiosInstance.get(`/api/admin/users/role/${role}`);
    return response.data
}

const addNewTeacher = async (data) => {
    console.log('check add teacher', data)
    const response = await axiosInstance.post('/api/admin/teachers/register', data);
    return response;
}

const addNewStudent = async (data) => {
    console.log('check add student', data)
    const response = await axiosInstance.post('/api/admin/students/register', data);
    return response;
}

// Test endpoints for debugging
const testAdminController = async () => {
    console.log('Testing admin controller...')
    const response = await axiosInstance.get('/api/admin/test');
    return response;
}

const addNewTeacherSimple = async (data) => {
    console.log('check add teacher simple', data)
    const response = await axiosInstance.post('/api/admin/teachers/register-simple', data);
    return response;
}

const addNewTeacherNoValidation = async (data) => {
    console.log('check add teacher no validation', data)
    const response = await axiosInstance.post('/api/admin/teachers/register-no-validation', data);
    return response;
}

const updateStudentByAdmin = async (studentId, data) => {
    const response = await axiosInstance.put(`/api/admin/students/update/${studentId}`, data);
    return response.data;
};

const updateTeacherByAdmin = async (teacherId, data) => {
    const response = await axiosInstance.put(`/api/admin/teachers/update/${teacherId}`, data);
    return response.data;
};

const deleteStudentById = async (studentId) => {
    const response = await axiosInstance.delete(`/api/admin/student/delete/${studentId}`);
    return response.data;
};

const deleteTeacherById = async (teacherId) => {
    const response = await axiosInstance.delete(`/api/admin/teacher/delete/${teacherId}`);
    return response.data;
};

const searchUsers = async (params) => {
    const queryParams = new URLSearchParams();
    if (params.fullname) queryParams.append('fullname', params.fullname);
    if (params.email) queryParams.append('email', params.email);
    
    const response = await axiosInstance.get(`/api/admin/users/search?${queryParams.toString()}`);
    return response.data;
};

export {
    fetchListUsers,
    addNewTeacher,
    addNewStudent,
    testAdminController,
    addNewTeacherSimple,
    addNewTeacherNoValidation,
    updateStudentByAdmin,
    updateTeacherByAdmin,
    deleteStudentById,
    deleteTeacherById,
    searchUsers
}