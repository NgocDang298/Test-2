package com.HTTN.thitn.controller;

import com.HTTN.thitn.dto.Response.UserDTO;
import com.HTTN.thitn.payload.ApiResponse;
import com.HTTN.thitn.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> getUserProfile(Principal principal) {
        String username = principal.getName(); // lấy từ JWT
        UserDTO userDTO = userService.getUserProfile(username);
        ApiResponse<UserDTO> response = new ApiResponse<>(true, "Lấy thông tin người dùng thành công.", userDTO);
        return ResponseEntity.ok(response);
    }
}
