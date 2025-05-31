package com.HTTN.thitn.dto.Response;

import lombok.Data;

import java.util.Set;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String fullname;
    private String email;
    private Set<String> roles;
}
