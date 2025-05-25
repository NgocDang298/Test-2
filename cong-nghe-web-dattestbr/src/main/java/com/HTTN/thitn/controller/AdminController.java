package com.HTTN.thitn.controller;

import com.HTTN.thitn.dto.Request.RegisterRequest;
import com.HTTN.thitn.dto.Request.StudentUpdateRequest;
import com.HTTN.thitn.dto.Request.TeacherUpdateRequest;
import com.HTTN.thitn.dto.Response.UserDTO;
import com.HTTN.thitn.entity.User;
import com.HTTN.thitn.payload.ApiResponse;
import com.HTTN.thitn.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @PutMapping("/students/update/{studentId}")
    public ResponseEntity<ApiResponse<Void>> updateStudentByAdmin(
            @PathVariable Long studentId,
            @RequestBody @Valid StudentUpdateRequest request) {

        userService.updateStudentById(studentId, request);
        ApiResponse<Void> response = new ApiResponse<>(true,
                String.format("Thông tin sinh viên có ID %d đã được cập nhật.", studentId),
                null);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/teachers/update/{teacherId}")
    public ResponseEntity<ApiResponse<Void>> updateTeacherByAdmin(
            @PathVariable Long teacherId,
            @RequestBody @Valid TeacherUpdateRequest request) {

        userService.updateTeacherById(teacherId, request);
        ApiResponse<Void> response = new ApiResponse<>(true,
                String.format("Thông tin giáo viên có ID %d đã được cập nhật.", teacherId),
                null);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/role/{role}")
    public ResponseEntity<ApiResponse<List<UserDTO>>> findUsersByRole(@PathVariable String role) {
        List<UserDTO> users = userService.findUsersByRoleName(role.toUpperCase());
        ApiResponse<List<UserDTO>> response = new ApiResponse<>(true,
                String.format("Found %d user(s) with role %s.", users.size(), role.toUpperCase()),
                users);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/student/delete/{studentId}")
    public ResponseEntity<ApiResponse<String>> deleteStudentById(@PathVariable Long studentId) {
        Optional<String> response = userService.deleteStudentById(studentId);

        ApiResponse<String> apiResponse;
        if (response.isPresent()) {
            apiResponse = new ApiResponse<>(true, response.get(), null);
            return ResponseEntity.ok(apiResponse);
        } else {
            apiResponse = new ApiResponse<>(false, "Không tìm thấy sinh viên với ID " + studentId, null);
            return ResponseEntity.badRequest().body(apiResponse);
        }
    }

    @DeleteMapping("/teacher/delete/{teacherId}")
    public ResponseEntity<ApiResponse<String>> deleteTeacherById(@PathVariable Long teacherId) {
        Optional<String> response = userService.deleteTeacherById(teacherId);

        ApiResponse<String> apiResponse;
        if (response.isPresent()) {
            apiResponse = new ApiResponse<>(true, response.get(), null);
            return ResponseEntity.ok(apiResponse);
        } else {
            apiResponse = new ApiResponse<>(false, "Không tìm thấy giáo viên với ID " + teacherId, null);
            return ResponseEntity.badRequest().body(apiResponse);
        }
    }


    @PostMapping("/teachers/register")
    public ResponseEntity<ApiResponse<String>> registerTeacherByAdmin(
            @RequestBody @Valid RegisterRequest request) {
        try {
            userService.registerTeacher(request);
            ApiResponse<String> response = new ApiResponse<>(true,
                    String.format("Đã đăng ký thành công tài khoản cho giáo viên: %s", request.getUsername()),
                    null);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            ApiResponse<String> response = new ApiResponse<>(false, e.getMessage(), null);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/users/search")
    public ResponseEntity<ApiResponse<List<UserDTO>>> searchUsers(
            @RequestParam(value = "fullname", required = false) String fullname,
            @RequestParam(value = "email", required = false) String email) {

        List<UserDTO> users = null;
        String message = "Kết quả tìm kiếm người dùng.";

        if (fullname != null && !fullname.trim().isEmpty()) {
            users = userService.searchUsersByFullName(fullname);
            message = "Tìm thấy " + users.size() + " người dùng theo tên: " + fullname;
        } else if (email != null && !email.trim().isEmpty()) {
            users = userService.searchUsersByEmail(email);
            message = "Tìm thấy " + users.size() + " người dùng theo email: " + email;
        } else if (fullname != null && !fullname.trim().isEmpty() && email != null && !email.trim().isEmpty()) {
            // Bạn có thể chọn tìm kiếm kết hợp hoặc xử lý riêng lẻ
            users = userService.searchUsersByNameOrEmail(fullname);
            message = "Tìm thấy " + users.size() + " người dùng theo tên hoặc email: " + fullname + " / " + email;
        } else {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Vui lòng cung cấp tham số tìm kiếm (fullname hoặc email).", null));
        }

        ApiResponse<List<UserDTO>> response = new ApiResponse<>(true, message, users);
        return ResponseEntity.ok(response);
    }
}
