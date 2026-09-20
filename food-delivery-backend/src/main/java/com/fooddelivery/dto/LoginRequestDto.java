package com.fooddelivery.dto;  // ✅ ADD THIS

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data

//LoginRequestDto.java
public class LoginRequestDto{
    @NotBlank(message="email is required")
    @Email
    private String email;
    @NotBlank(message=" Password is required")
    private String password;
}