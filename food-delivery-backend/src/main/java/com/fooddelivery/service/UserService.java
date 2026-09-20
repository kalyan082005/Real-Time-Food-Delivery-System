package com.fooddelivery.service;


import com.fooddelivery.dto.UserResponseDto;
import com.fooddelivery.entity.User;
import com.fooddelivery.entity.UserRole;
import com.fooddelivery.dto.UserRegistrationDto;  // ✅ ADD THIS
import com.fooddelivery.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
    @Autowired
    public UserRepository userRepository;
    @Autowired
    public PasswordEncoder passwordEncoder;

    public UserResponseDto registerUser(UserRegistrationDto registrationDto){
        if(userRepository.existsByEmail(registrationDto.getEmail())){
            throw new RuntimeException("Email already registered");
        }

        //Create a new user entity
        User user = new User();
        user.setEmail(registrationDto.getEmail());
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        user.setName(registrationDto.getName());
        user.setPhone(registrationDto.getPhone());
        user.setRole(registrationDto.getRole());

        //Save to db
        User SavedUser = userRepository.save(user);

        return convertToResponseDto(SavedUser);

    }
    //Authenticate user login
    public UserResponseDto authenticateUser(String email,String password){
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("User not found"));

        if(!passwordEncoder.matches(password,user.getPassword())){
            throw new IllegalArgumentException("Invalid Credentials");
        }

        if(!user.getIsActive()){
            throw new IllegalArgumentException("Account is deactivated");
        }
        return convertToResponseDto(user);

    }
    //Get user by role
    public List<UserResponseDto> getUsersByRole(UserRole role){

        List<User> users = userRepository.findByRole(role);
        return users.stream()
                    .map(this::convertToResponseDto)
                    .collect(Collectors.toList());
    }
    public UserResponseDto getUserByEmail1(String email) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    
    UserResponseDto dto = new UserResponseDto();
    dto.setId(user.getId());
    dto.setEmail(user.getEmail());
    dto.setName(user.getName());
    dto.setPhone(user.getPhone());
    dto.setRole(user.getRole());
    dto.setCreatedAt(user.getCreatedAt());
    
    return dto;
    }


    // Get user by email
    public UserResponseDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToResponseDto(user);
    }

    // Get user by ID
    public UserResponseDto getUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return convertToResponseDto(user);
    }

    private UserResponseDto convertToResponseDto(User user){
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;

    }





    
}
