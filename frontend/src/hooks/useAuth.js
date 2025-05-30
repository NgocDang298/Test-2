import useAuthStore from '../stores/authStore';

// Custom hook để dễ dàng sử dụng auth store
const useAuth = () => {
  const {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    fetchUserProfile,
    updateUser,
    hasRole,
    hasAnyRole,
    setLoading,
    setError,
    clearError
  } = useAuthStore();

  // Helper functions
  const isAdmin = () => hasRole('admin');
  const isTeacher = () => hasRole('teacher');
  const isStudent = () => hasRole('student');
  
  const canAccessAdmin = () => hasRole('admin');
  const canAccessTeacher = () => hasAnyRole(['admin', 'teacher']);
  const canAccessStudent = () => hasAnyRole(['admin', 'teacher', 'student']);

  return {
    // State
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    logout,
    fetchUserProfile,
    updateUser,
    setLoading,
    setError,
    clearError,
    
    // Role checks
    hasRole,
    hasAnyRole,
    isAdmin,
    isTeacher,
    isStudent,
    canAccessAdmin,
    canAccessTeacher,
    canAccessStudent
  };
};

export default useAuth; 