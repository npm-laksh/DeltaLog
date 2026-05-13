package com.laksh.app.deltalog.controller;

import com.laksh.app.deltalog.dto.request.LoginRequestDTO;
import com.laksh.app.deltalog.dto.request.RegisterRequestDTO;
import com.laksh.app.deltalog.dto.request.DeleteUserRequestDTO;
import com.laksh.app.deltalog.dto.response.DeleteUserResponseDTO;
import com.laksh.app.deltalog.dto.response.LoginResponseDTO;
import com.laksh.app.deltalog.dto.response.RegisterResponseDTO;
import com.laksh.app.deltalog.entity.User;
import com.laksh.app.deltalog.repository.UserRepo;
import com.laksh.app.deltalog.service.AuthService;
import com.laksh.app.deltalog.service.impl.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Autowired
    private final JwtService jwtService;

    @Autowired
    private final AuthenticationManager authenticationManager;

    @Autowired
    private final UserRepo userRepo;

    @PostMapping("/register-user")
    public ResponseEntity<RegisterResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        RegisterResponseDTO response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // traditional login controller
//    @PostMapping("/login")
//    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
//        LoginResponseDTO response = authService.login(request);
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        if (authentication.isAuthenticated()) {
            String token = jwtService.generateToken(request.email());

            // fetch user info to populate the DTO
            User user = userRepo.findByEmail(request.email()).orElseThrow();

            LoginResponseDTO response = new LoginResponseDTO(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole(),
                    "Login Successful",
                    token
            );
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @DeleteMapping("/delete-user")
    public ResponseEntity<DeleteUserResponseDTO> delete(@RequestBody DeleteUserRequestDTO request) {
        DeleteUserResponseDTO response = authService.deleteUser(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

//    @PostMapping("/logout/{userId}")
//    public ResponseEntity<String> logout(@PathVariable Integer userId) {
//        authService.logout(userId);
//        return ResponseEntity.ok("User logged out & work session closed successfully");
//    }

//    @PostMapping("/logout")
//    public ResponseEntity<String> logout() {
//        // Get the email/username from the validated JWT automatically
//        String email = SecurityContextHolder.getContext().getAuthentication().getName();
//        authService.logoutByEmail(email);
//        return ResponseEntity.ok("Logged out successfully");
//    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(Authentication authentication) {
        if (authentication == null || authentication.getName().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No active session found");
        }

        // Get the email/username from the validated JWT automatically
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        authService.logoutByEmail(authentication.getName());
        return ResponseEntity.ok("Logged out successfully");
    }
}
