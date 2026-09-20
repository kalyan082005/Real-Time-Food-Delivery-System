package com.fooddelivery.controller;


import com.fooddelivery.dto.*;
import com.fooddelivery.entity.UserRole;
import com.fooddelivery.service.UserService;
import com.fooddelivery.util.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController //Controller(makes it as a controller) + Responsebody(Automatocally Converts java object to Json
@RequestMapping("/api/auth") // sets a base url for all the apis in the controller
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})//it alolows backend api to alow requests from a diff origin like frontend 3000 and backend 8080 it accepts both // but here allows only react frontend
public class UserController {
    @Autowired //(Injects it automatically - Dependency injection)
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponseDto>> registerUser(@Valid @RequestBody UserRegistrationDto registrationDto){
        try{
            UserResponseDto user = userService.registerUser(registrationDto);
            ApiResponse<UserResponseDto> response = new ApiResponse<>(
                    true,
                    "User registered Successfully",
                    user
            );
            return new ResponseEntity<>(response,HttpStatus.CREATED);
        } catch(Exception e){
            ApiResponse<UserResponseDto> response = new ApiResponse<>(
                    false,
                    e.getMessage(),
                    null
            );
            return new ResponseEntity<>(response,HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDto>> loginUser(
            @Valid @RequestBody LoginRequestDto loginRequest){
        try {
            UserResponseDto user = userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
            String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().toString());

            LoginResponseDto loginResponse = new LoginResponseDto();
            loginResponse.setUser(user);
            loginResponse.setToken(token);
            loginResponse.setTokenType("Bearer");

            ApiResponse<LoginResponseDto> response = new ApiResponse<>(
                    true,
                    "Login successful",
                    loginResponse
            );
            return new ResponseEntity<>(response,HttpStatus.CREATED);
            

        }catch(Exception e){
            ApiResponse<LoginResponseDto> response = new ApiResponse<>(
                    false,
                    e.getMessage(),
                    null
            );
            return new ResponseEntity<>(response,HttpStatus.BAD_REQUEST);
        }  // End of catch
    }  // End of loginUser method

    @GetMapping("/users")  // ✅ Protected endpoint - requires JWT
    public ResponseEntity<ApiResponse<List<UserResponseDto>>> getUsersByRole(
            @RequestParam UserRole role) {
        List<UserResponseDto> users = userService.getUsersByRole(role);
        ApiResponse<List<UserResponseDto>> response = new ApiResponse<>(
                true,
                "Users retrieved successfully",
                users
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/profile")  // ✅ Protected endpoint - requires JWT
    public ResponseEntity<ApiResponse<UserResponseDto>> getUserProfile() {
        try {
            // Get authenticated user ID from SecurityContext
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userId = authentication.getName();
            
            // Get user by ID (not email)
            UserResponseDto user = userService.getUserById(userId);
            ApiResponse<UserResponseDto> response = new ApiResponse<>(
                    true,
                    "Profile retrieved successfully",
                    user
            );
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            ApiResponse<UserResponseDto> response = new ApiResponse<>(
                    false,
                    e.getMessage(),
                    null
            );
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/me")  // ✅ Alias for /profile - frontend expects this
    public ResponseEntity<ApiResponse<UserResponseDto>> getCurrentUser() {
        return getUserProfile();  // Reuse the same logic
    }

}










































