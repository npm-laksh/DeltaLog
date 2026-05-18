package com.laksh.app.deltalog.service.impl;

import com.laksh.app.deltalog.dto.request.DeleteUserRequestDTO;
import com.laksh.app.deltalog.dto.request.LoginRequestDTO;
import com.laksh.app.deltalog.dto.request.RegisterRequestDTO;
import com.laksh.app.deltalog.dto.response.DeleteUserResponseDTO;
import com.laksh.app.deltalog.dto.response.LoginResponseDTO;
import com.laksh.app.deltalog.dto.response.RegisterResponseDTO;
import com.laksh.app.deltalog.entity.User;
import com.laksh.app.deltalog.enums.AttendanceStatus;
import com.laksh.app.deltalog.exception.UserNotFoundException;
import com.laksh.app.deltalog.mapper.UserMapper;
import com.laksh.app.deltalog.repository.AttendanceRepo;
import com.laksh.app.deltalog.repository.UserRepo;
import com.laksh.app.deltalog.service.AttendanceService;
import com.laksh.app.deltalog.service.AuthService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {
    
    private final UserRepo userRepo;
    private final AttendanceRepo attendanceRepo;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AttendanceService attendanceService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

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

//        System.out.println("Encoded password length: " + encodedPassword.length());
        // 6. return safe response
        return userMapper.toRegisterResponseDTO(savedUser);
    }

    // login logic
//    public LoginResponseDTO login(LoginRequestDTO request) {
//        // 1. find user by email
//        User user = userRepo
//                .findByEmail(request.email())
//                .orElseThrow(() -> new RuntimeException("User email not found"));
//
//        // 2. check password (bcrypt)
//        boolean matches = passwordEncoder.matches(
//                request.password(),
//                user.getPassword()
//        );
////
//        if (!matches) {
//            throw new RuntimeException("Invalid password");
//        }
//
//        // check password, uncomment above code to use bcrypt
////        if (!request.password().equals(user.getPassword())) {
//////            String message = "Invalid password";
////            throw new RuntimeException("Invalid password");
////        }
//
//        // 3. update last login
//        user.setLastLogin(LocalDateTime.now());
//        userRepo.save(user);
//
//        // 4. return response
//        return new LoginResponseDTO(
//                user.getId(),
//                user.getUsername(),
//                user.getEmail(),
//                user.getRole(),
//                "Login successful"
////                "Login Successful" // to handle status msg in dto
//        );
//
//    }

public LoginResponseDTO login(LoginRequestDTO request) {
    // 1. Let Spring Security handle the "Matches" check
    // This replaces your manual passwordEncoder.matches() logic
    Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password())
    );

    // 2. If we reach here, authentication was successful.
    // Fetch the user to update the lastLogin timestamp
    User user = userRepo.findByEmail(request.email())
            .orElseThrow(() -> new RuntimeException("User email not found"));

    user.setLastLogin(LocalDateTime.now());
    userRepo.save(user);

    // 3. Generate the JWT "Passport"
    String jwtToken = jwtService.generateToken(user.getEmail());

    // 4. Return response including the token
    return new LoginResponseDTO(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole(),
            "Login successful",
            jwtToken // Pass the generated token to your updated DTO
    );
}

    public void logout(Integer userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Optional: If you want to force a check-out when they log out:
        attendanceService.completeActiveSession(user);

        // Log the event or invalidate server-side session if using one
        System.out.println("User " + user.getEmail() + " has logged out.");
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

    @Override
    public void logoutByEmail(String email) {
        // 1. Find the user based on the email extracted from the SecurityContext/JWT
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        // 2. Reuse your existing service to close the attendance record
        // This likely sets the 'checkOut' time and updates status to 'ABSENT' or 'COMPLETED'
        attendanceService.completeActiveSession(user);

        // 3. Log the event
        System.out.println("Work session closed for user: " + email + " at " + LocalDateTime.now());
    }
}
