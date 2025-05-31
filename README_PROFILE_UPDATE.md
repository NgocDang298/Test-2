# Profile Management System Implementation

## Tổng quan
Đã hoàn thiện hệ thống quản lý profile người dùng với các tính năng:
- Tự động gọi API profile sau khi login
- Lưu thông tin user vào UserContext/Store
- Cập nhật profile (fullname, phone, birthday, address)
- Đổi mật khẩu
- Hiển thị thống kê người dùng

## Các thay đổi chính

### 1. Backend Changes

#### User Entity (User.java)
```java
// Thêm các trường mới
@Column
private String phone;

@Column
private LocalDate birthday;

@Column
private String address;
```

#### UserDTO (UserDTO.java)
```java
// Mở rộng DTO để bao gồm thông tin đầy đủ
private String username;
private String phone;
private LocalDate birthday;
private String address;
private Set<String> roles;
```

#### UserUpdateRequest (UserUpdateRequest.java)
```java
// DTO mới cho việc cập nhật profile
private String fullname;
private String phone;
private LocalDate birthday;
private String address;
```

#### UserController (UserController.java)
```java
// Thêm endpoint update profile
@PutMapping("/profile")
public ResponseEntity<ApiResponse<String>> updateUserProfile(
        @RequestBody @Valid UserUpdateRequest request, Principal principal) {
    String username = principal.getName();
    userService.updateUserProfile(username, request);
    return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật thành công", null));
}
```

#### UserService (UserService.java)
```java
// Thêm method update profile
public void updateUserProfile(String username, UserUpdateRequest request) {
    User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    
    if (request.getFullname() != null && !request.getFullname().trim().isEmpty()) {
        user.setFullname(request.getFullname());
    }
    // ... cập nhật các trường khác
    
    userRepository.save(user);
}

// Cập nhật convertToUserDTO để bao gồm tất cả thông tin
private UserDTO convertToUserDTO(User user) {
    UserDTO dto = new UserDTO();
    dto.setId(user.getId());
    dto.setUsername(user.getUsername());
    dto.setFullname(user.getFullname());
    dto.setEmail(user.getEmail());
    dto.setPhone(user.getPhone());
    dto.setBirthday(user.getBirthday());
    dto.setAddress(user.getAddress());
    
    Set<String> roleNames = user.getRoles().stream()
            .map(role -> role.getName())
            .collect(Collectors.toSet());
    dto.setRoles(roleNames);
    
    return dto;
}
```

#### Database Migration
```sql
-- V2__Add_user_profile_fields.sql
ALTER TABLE users 
ADD COLUMN phone VARCHAR(20),
ADD COLUMN birthday DATE,
ADD COLUMN address TEXT;
```

### 2. Frontend Changes

#### UserContext (UserContext.js)
```javascript
// Context mới để quản lý state user toàn cục
const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Tự động fetch profile sau khi login
  const login = async (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    dispatch({ type: USER_ACTIONS.SET_USER, payload: decoded });
    
    // Fetch full user profile after login
    await fetchUserProfile();
  };

  const fetchUserProfile = async () => {
    const profileData = await getUserProfile();
    dispatch({ type: USER_ACTIONS.SET_USER_PROFILE, payload: profileData });
  };
};
```

#### UserService (UserService.js)
```javascript
// Service mới để xử lý API calls
export const getUserProfile = async () => {
  const response = await axiosInstance.get('/api/user/profile');
  return response.data.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await axiosInstance.put('/api/user/profile', profileData);
  return response.data.data;
};

export const changePassword = async (passwordData) => {
  const response = await axiosInstance.put('/api/auth/change-password', passwordData);
  return response.data;
};
```

#### ProfilePage (ProfilePage.js)
```javascript
// Hoàn toàn refactor để sử dụng UserContext
const ProfilePage = () => {
    const { userProfile, fetchUserProfile, loading, error } = useUser();
    
    const handleSubmit = async (e) => {
        // Update profile
        await updateUserProfile(profileUpdateData);
        
        // Change password if provided
        if (formData.currentPassword && formData.newPassword) {
            await changePassword(passwordData);
        }
        
        // Refresh user profile
        await fetchUserProfile();
    };
};
```

#### App.js
```javascript
// Sử dụng UserProvider để wrap toàn bộ app
function App() {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}
```

#### Routes Updates
- Loại bỏ tất cả props user, onLogin, onLogout
- Sử dụng UserContext trong ProtectedRoute
- Tự động redirect dựa trên role

## Luồng hoạt động

### 1. Login Flow
```
1. User nhập credentials → LoginPage
2. Call API login → nhận access token
3. UserContext.login(token):
   - Lưu token vào localStorage
   - Decode JWT để lấy basic info
   - Gọi fetchUserProfile() để lấy full profile
   - Lưu vào context state
4. Redirect to /home
5. Navbar hiển thị tên user từ userProfile
```

### 2. Profile Update Flow
```
1. User vào ProfilePage
2. Form hiển thị data từ userProfile context
3. User chỉnh sửa và submit
4. Call updateUserProfile API
5. Nếu có đổi password → call changePassword API
6. Gọi fetchUserProfile() để refresh data
7. Update context state
8. UI tự động re-render với data mới
```

### 3. Navigation Flow
```
1. Navbar lấy user info từ UserContext
2. Hiển thị fullname hoặc username
3. Dropdown menu với các options
4. Logout → clear context và localStorage
```

## API Endpoints

### User Profile
- `GET /api/user/profile` - Lấy thông tin profile
- `PUT /api/user/profile` - Cập nhật profile

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `PUT /api/auth/change-password` - Đổi mật khẩu

## State Management

### UserContext State
```javascript
{
  user: null,              // Basic user info từ JWT
  userProfile: null,       // Full profile từ API
  loading: false,          // Loading state
  error: null,             // Error message
  isAuthenticated: false   // Authentication status
}
```

### Actions
- `SET_USER` - Set basic user info
- `SET_USER_PROFILE` - Set full profile
- `SET_LOADING` - Set loading state
- `SET_ERROR` - Set error message
- `LOGOUT` - Clear all user data

## Cách sử dụng

### 1. Trong component
```javascript
import { useUser } from '../contexts/UserContext';

const MyComponent = () => {
  const { userProfile, loading, error, fetchUserProfile } = useUser();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>Hello {userProfile?.fullname}</div>;
};
```

### 2. Update profile
```javascript
import { updateUserProfile } from '../services/UserService';

const updateProfile = async (data) => {
  await updateUserProfile(data);
  await fetchUserProfile(); // Refresh context
};
```

### 3. Protected routes
```javascript
<ProtectedRoute allowedRoles={['STUDENT', 'TEACHER']}>
  <MyComponent />
</ProtectedRoute>
```

## Lưu ý quan trọng

1. **Database Migration**: Chạy migration để thêm các cột mới vào bảng users
2. **Token Expiry**: Context tự động handle token expiry và redirect to login
3. **Error Handling**: Tất cả API calls đều có error handling
4. **Loading States**: UI hiển thị loading khi fetch data
5. **Validation**: Form validation cho cả frontend và backend

## Testing

### 1. Test Login Flow
- Login với user hợp lệ
- Kiểm tra profile được load tự động
- Kiểm tra navbar hiển thị tên user

### 2. Test Profile Update
- Cập nhật từng trường một
- Test validation
- Test password change
- Kiểm tra data được refresh

### 3. Test Navigation
- Test protected routes
- Test role-based access
- Test logout functionality 