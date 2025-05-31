import axiosInstance from './axiosInstance';

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get('/api/user/profile');
    return response.data.data; // Assuming the API returns { success: true, message: "", data: userProfile }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put('/api/user/profile', profileData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    const response = await axiosInstance.put('/api/auth/change-password', passwordData);
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

// Get user statistics (for profile page)
export const getUserStats = async () => {
  try {
    const response = await axiosInstance.get('/api/user/stats');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    // Return default stats if API doesn't exist yet
    return {
      examsTaken: 0,
      averageScore: 0,
      lastActive: null,
      recentExams: []
    };
  }
};

export default {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserStats
}; 