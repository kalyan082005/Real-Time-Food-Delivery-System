package com.fooddelivery.dto;  // ✅ ADD THIS

import lombok.Data;

@Data

//LoginResponseDto.java
public class LoginResponseDto{
    private UserResponseDto user;
    private String token;
    private String tokenType;
    

}