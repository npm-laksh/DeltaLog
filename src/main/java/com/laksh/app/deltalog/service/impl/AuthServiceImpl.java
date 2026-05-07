package com.laksh.app.deltalog.service.impl;

import com.laksh.app.deltalog.dto.request.DeleteUserRequestDTO;
import com.laksh.app.deltalog.dto.request.LoginRequestDTO;
import com.laksh.app.deltalog.dto.request.RegisterRequestDTO;
import com.laksh.app.deltalog.dto.response.DeleteUserResponseDTO;
import com.laksh.app.deltalog.dto.response.LoginResponseDTO;
import com.laksh.app.deltalog.dto.response.RegisterResponseDTO;
import com.laksh.app.deltalog.entity.User;
import com.laksh.app.deltalog.mapper.UserMapper;
import com.laksh.app.deltalog.repository.UserRepo;
import com.laksh.app.deltalog.service.AuthService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {
    
    private final UserRepo userRepo;
    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder;

    // register logic
    public RegisterResponseDTO register(RegisterRequestDTO request) {

        // 1. checks if username exists
//        if(userRepo.findByUsername(request.username()).isPresent()) {
//            throw new RuntimeException("Username already exists");
//        }

        // 2. checks if email exists
        if(userRepo.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // 3. convert DTO to entity
        User user = userMapper.toEntity(request);

        // 4. encrypt password before saving to db
        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        user.setPassword(user.getPassword());
        // 5. save user
        User savedUser = userRepo.save(user);

        // 6. return safe response
        return userMapper.toRegisterResponseDTO(savedUser);
    }

    // login logic
    public LoginResponseDTO login(LoginRequestDTO request) {
        // 1. find user by email
        User user = userRepo
                .findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("User email not found"));

        // 2. check password (bcrypt)
        boolean matches = passwordEncoder.matches(
                request.password(),
                user.getPassword()
        );
//
        if (!matches) {
            throw new RuntimeException("Invalid password");
        }

        // check password, uncomment above code to use bcrypt
//        if (!request.password().equals(user.getPassword())) {
////            String message = "Invalid password";
//            throw new RuntimeException("Invalid password");
//        }

        // 3. update last login
        user.setLastLogin(LocalDateTime.now());
        userRepo.save(user);

        // 4. return response
        return new LoginResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                "Login successful"
//                "Login Successful" // to handle status msg in dto
        );

    }

    @Transactional
    // When you delete a User, Hibernate has to go into the Attendance table and the Task table to delete those related rows first (due to your Cascade settings). If something goes wrong halfway through (e.g., the database connection blips)
    // @Transactional ensures that nothing is deleted at all, preventing "orphaned" data.
    public DeleteUserResponseDTO deleteUser(DeleteUserRequestDTO request) {
        // 1. Find the user by username
        User user = userRepo.findByUsername(request.username())
                .orElseThrow(() -> new RuntimeException("User not found with username: " + request.username()));

        // 2. Capture the ID before deletion for the response
        Integer userId = user.getId();

        // 3. Delete the user
        // Because of CascadeType.ALL, this also wipes their Attendance and Tasks
        userRepo.delete(user);

        // 4. Return the response DTO
        return new DeleteUserResponseDTO(
                userId,
                "User '" + request.username() + "' has been successfully removed from the system.",
                LocalDateTime.now()
        );
    }
}
