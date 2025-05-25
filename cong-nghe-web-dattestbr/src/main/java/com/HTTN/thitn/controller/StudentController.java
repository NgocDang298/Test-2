package com.HTTN.thitn.controller;

import com.HTTN.thitn.dto.Request.StudentUpdateRequest;
import com.HTTN.thitn.payload.ApiResponse;
import com.HTTN.thitn.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final UserService userService;

    @PutMapping("/update-info")
    public ResponseEntity<ApiResponse<String>> updateStudentInfo(@RequestBody @Valid StudentUpdateRequest request, Principal principal) {
        String username = principal.getName();
        userService.updateStudentInfo(username, request);
        ApiResponse<String> response = new ApiResponse<>(true, "Thông tin sinh viên đã được cập nhật.", null);
        return ResponseEntity.ok(response);
    }
}
