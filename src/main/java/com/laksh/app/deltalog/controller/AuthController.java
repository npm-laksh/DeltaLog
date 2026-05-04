package com.laksh.app.deltalog.controller;

import com.laksh.app.deltalog.dto.request.LoginRequestDTO;
import com.laksh.app.deltalog.dto.request.RegisterRequestDTO;
import com.laksh.app.deltalog.dto.response.DeleteUserRequestDTO;
import com.laksh.app.deltalog.dto.response.DeleteUserResponseDTO;
import com.laksh.app.deltalog.dto.response.LoginResponseDTO;
import com.laksh.app.deltalog.dto.response.RegisterResponseDTO;
import com.laksh.app.deltalog.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register-user")
    public ResponseEntity<RegisterResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        RegisterResponseDTO response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        LoginResponseDTO response = authService.login(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/delete-user")
    public ResponseEntity<DeleteUserResponseDTO> delete(@RequestBody DeleteUserRequestDTO request) {
        DeleteUserResponseDTO response = authService.deleteUser(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
