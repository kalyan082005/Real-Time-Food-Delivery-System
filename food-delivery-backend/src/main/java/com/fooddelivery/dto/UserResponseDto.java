//UserResponseDto.java
package com.fooddelivery.dto;  // ✅ ADD THIS

import com.fooddelivery.entity.UserRole;
import lombok.Data;
import java.time.LocalDateTime;

@Data

public class UserResponseDto{
    private String id;
    private String email;
    private String name;
    private String phone;
    private UserRole role;  // ✅ ADD THIS
    private LocalDateTime createdAt;  // ✅ ADD THI

}