package com.HTTN.thitn.dto.Response;

import lombok.Data;
import java.time.LocalDate;
import java.util.Set;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String fullname;
    private String email;
    private String phone;
    private LocalDate birthday;
    private String address;
    private Set<String> roles;
}
