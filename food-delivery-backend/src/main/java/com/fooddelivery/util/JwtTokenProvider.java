package com.fooddelivery.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {
    @Autowired
    private JwtUtil jwtUtil;
    
    public String generateToken(String userId, String email, String role){
        return jwtUtil.generateToken(userId, email, role);
    }
}
