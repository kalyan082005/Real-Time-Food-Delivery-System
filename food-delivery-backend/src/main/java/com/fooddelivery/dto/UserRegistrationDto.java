package com.fooddelivery.dto;

import com.fooddelivery.entity.UserRole;
import jakarta.validation.constraints.*;

import lombok.Data;
 

@Data
public class UserRegistrationDto {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "password is required")
    @Size(min = 6, message = "password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Name is required")
    private String name;

    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Phone must be 10-15 digits, optionally starting with +")
    private String phone;

    @NotNull(message = "Role is required")
    private UserRole role;


}


























