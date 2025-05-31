package com.HTTN.thitn.dto.Request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UserUpdateRequest {
    private String fullname;
    private String phone;
    private LocalDate birthday;
    private String address;
} 