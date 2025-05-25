package com.HTTN.thitn.controller;

import com.HTTN.thitn.dto.Request.TeacherUpdateRequest;
import com.HTTN.thitn.dto.Response.UserDTO;
import com.HTTN.thitn.entity.User;
import com.HTTN.thitn.payload.ApiResponse;
import com.HTTN.thitn.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
public class TeacherController {

    private final UserService userService;

    @PutMapping("/update-info")
    public ResponseEntity<ApiResponse<String>> updateTeacherInfo(@RequestBody @Valid TeacherUpdateRequest request, Principal principal) {
        String username = principal.getName();
        userService.updateTeacherInfo(username, request);

        ApiResponse<String> response = new ApiResponse<>(true, "Thông tin giáo viên đã được cập nhật.", null);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/student/findall")
    public ResponseEntity<ApiResponse<List<UserDTO>>> findAllStudents() {
        List<UserDTO> users = userService.findUsersByRoleName("STUDENT");
        ApiResponse<List<UserDTO>> response = new ApiResponse<>(true, "Danh sách sinh viên.", users);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/student/search")
    public ResponseEntity<ApiResponse<List<UserDTO>>> searchStudents(
            @RequestParam(value = "fullname", required = false) String fullname,
            @RequestParam(value = "email", required = false) String email) {

        List<UserDTO> students = null;
        String message = "Kết quả tìm kiếm sinh viên.";

        if (fullname != null && !fullname.trim().isEmpty()) {
            students = userService.searchUsersByRoleNameAndFullName("STUDENT", fullname);
            message = "Tìm thấy " + students.size() + " sinh viên theo tên: " + fullname;
        } else if (email != null && !email.trim().isEmpty()) {
            students = userService.searchUsersByRoleNameAndEmail("STUDENT", email);
            message = "Tìm thấy " + students.size() + " sinh viên theo email: " + email;
        } else if (fullname != null && !fullname.trim().isEmpty() && email != null && !email.trim().isEmpty()) {
            students = userService.searchUsersByRoleNameAndFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase("STUDENT", fullname, email);
            message = "Tìm thấy " + students.size() + " sinh viên theo tên hoặc email: " + fullname + " / " + email;
        } else {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Vui lòng cung cấp tham số tìm kiếm (fullname hoặc email).", null));
        }

        ApiResponse<List<UserDTO>> response = new ApiResponse<>(true, message, students);
        return ResponseEntity.ok(response);
    }
}