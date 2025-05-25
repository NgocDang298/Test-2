package com.HTTN.thitn.dto.Request;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String fullname;
    private String email;
}
