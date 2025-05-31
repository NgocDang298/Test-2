package com.HTTN.thitn.controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
	private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
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

        logger.info("Admin attempting to register new teacher with username: {}", request.getUsername());

        try {
            userService.registerTeacher(request);
            String successMessage = String.format("Đã đăng ký thành công tài khoản cho giáo viên: %s", request.getUsername());
            logger.info("Teacher registration successful for username: {}", request.getUsername());

            ApiResponse<String> response = new ApiResponse<>(true, successMessage, null);
            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (IllegalArgumentException e) {
            logger.warn("Teacher registration failed for username: {}. Reason: {}", request.getUsername(), e.getMessage());

            ApiResponse<String> response = new ApiResponse<>(false, e.getMessage(), null);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            logger.error("Unexpected error during teacher registration for username: {}", request.getUsername(), e);

            ApiResponse<String> response = new ApiResponse<>(false, "Lỗi không xác định trong quá trình đăng ký.", null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/users/search")
    public ResponseEntity<ApiResponse<List<UserDTO>>> searchUsers(
            @RequestParam(value = "query", required = false) String query) {

        List<UserDTO> users = null;
        String message = "Kết quả tìm kiếm người dùng.";

        if (query != null && !query.trim().isEmpty()) {
            users = userService.searchUsersByNameOrEmail(query);
            message = "Tìm thấy " + users.size() + " người dùng với từ khóa: " + query;
        } else {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Vui lòng cung cấp từ khóa tìm kiếm.", null));
        }

        ApiResponse<List<UserDTO>> response = new ApiResponse<>(true, message, users);
        return ResponseEntity.ok(response);
    }
}
