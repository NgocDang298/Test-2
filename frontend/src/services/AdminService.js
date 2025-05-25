import axiosInstance from "./axiosInstance"

const fetchListUsers = async (role,) => {
    const response = await axiosInstance.get(`/api/admin/users/role/${role}`);
    return response.data
}
const addNewTeacher = async (data) => {
    console.log('check add teacher', data)
    const response = await axiosInstance.post('/api/admin/teachers/register', data);
    return response;
}
export {
    fetchListUsers,
    addNewTeacher
}