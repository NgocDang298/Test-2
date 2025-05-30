import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../services/axiosInstance';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),

      // Login action
      login: async (accessToken) => {
        try {
          set({ isLoading: true, error: null });
          
          // Decode accessToken để lấy thông tin cơ bản
          const decoded = jwtDecode(accessToken);
          console.log('Decoded accessToken:', decoded);
          
          // Lưu accessToken
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('accessToken', accessToken); // Backward compatibility
          
          // Set accessToken vào store
          set({ accessToken, isAuthenticated: true });
          
          // Gọi API /profile để lấy đầy đủ thông tin user
          await get().fetchUserProfile();
          
        } catch (error) {
          console.error('Login error:', error);
          set({ 
            error: 'Đăng nhập thất bại', 
            isAuthenticated: false, 
            accessToken: null, 
            user: null 
          });
          localStorage.removeItem('accessToken');
          localStorage.removeItem('accessToken');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Fetch user profile from API
      fetchUserProfile: async () => {
        try {
          set({ isLoading: true });
          
          // Lấy thông tin từ JWT accessToken trước
          const accessToken = get().accessToken || localStorage.getItem('accessToken');
          let jwtData = {};
          
          if (accessToken) {
            try {
              const decoded = jwtDecode(accessToken);
              console.log('JWT decoded:', decoded);
              
              // Lấy role từ roles array
              let role = 'student'; // default
              if (decoded.roles && Array.isArray(decoded.roles) && decoded.roles.length > 0) {
                // Lấy role đầu tiên và loại bỏ prefix "ROLE_"
                role = decoded.roles[0].replace('ROLE_', '').toLowerCase();
              }
              
              jwtData = {
                username: decoded.sub,
                role: role
              };
              
              console.log('Extracted JWT data:', jwtData);
            } catch (error) {
              console.error('JWT decode error:', error);
            }
          }
          
          // Gọi API để lấy thông tin profile
          const response = await axiosInstance.get('/api/user/profile');
          console.log('Profile response:', response.data);
          
          if (response.data.success) {
            const profileData = response.data.data;
            
            // Kết hợp thông tin từ JWT và API profile
            const userData = {
              id: profileData.id,
              username: jwtData.username || profileData.username || 'unknown',
              name: profileData.fullname || profileData.name,
              fullname: profileData.fullname,
              email: profileData.email,
              role: jwtData.role?.toLowerCase() || 'student'
            };
            
            console.log('Combined user data:', userData);
            
            set({ 
              user: userData,
              isAuthenticated: true,
              error: null 
            });
          } else {
            throw new Error('Failed to fetch profile');
          }
        } catch (error) {
          console.error('Fetch profile error:', error);
          
          // Nếu API profile thất bại, thử sử dụng chỉ JWT data
          const accessToken = get().accessToken || localStorage.getItem('accessToken');
          if (accessToken) {
            try {
              const decoded = jwtDecode(accessToken);
              console.log('Fallback JWT decoded:', decoded);
              
              // Lấy role từ roles array
              let role = 'student'; // default
              if (decoded.roles && Array.isArray(decoded.roles) && decoded.roles.length > 0) {
                role = decoded.roles[0].replace('ROLE_', '').toLowerCase();
              }
              
              const fallbackUserData = {
                username: decoded.sub || 'unknown',
                name: decoded.sub || 'User',
                role: role
              };
              
              console.log('Using fallback JWT data:', fallbackUserData);
              
              set({ 
                user: fallbackUserData,
                isAuthenticated: true,
                error: 'Không thể lấy đầy đủ thông tin người dùng, sử dụng thông tin cơ bản'
              });
              return;
            } catch (jwtError) {
              console.error('JWT fallback error:', jwtError);
            }
          }
          
          set({ 
            error: 'Không thể lấy thông tin người dùng',
            user: null,
            isAuthenticated: false 
          });
          
          // Nếu lỗi 401, logout user
          if (error.response?.status === 401) {
            get().logout();
          }
        } finally {
          set({ isLoading: false });
        }
      },

      // Logout action
      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null
        });
      },

      // Initialize auth from localStorage
      initializeAuth: async () => {
        try {
          const accessToken = localStorage.getItem('accessToken');
          if (accessToken) {
            // Kiểm tra accessToken có hợp lệ không
            const decoded = jwtDecode(accessToken);
            const currentTime = Date.now() / 1000;
            
            if (decoded.exp > currentTime) {
              set({ accessToken, isAuthenticated: true });
              await get().fetchUserProfile();
            } else {
              // Token hết hạn
              get().logout();
            }
          }
        } catch (error) {
          console.error('Initialize auth error:', error);
          get().logout();
        }
      },

      // Update user info
      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
      },

      // Check if user has specific role
      hasRole: (role) => {
        const user = get().user;
        if (!user) return false;
        
        const userRole = user.role?.toLowerCase();
        const checkRole = role.toLowerCase();
        
        return userRole === checkRole;
      },

      // Check if user has any of the specified roles
      hasAnyRole: (roles) => {
        const user = get().user;
        if (!user) return false;
        
        const userRole = user.role?.toLowerCase();
        return roles.some(role => userRole === role.toLowerCase());
      }
    }),
    {
      name: 'auth-storage', // unique name
      storage: createJSONStorage(() => localStorage),
      // Chỉ persist những field cần thiết
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

export default useAuthStore; 