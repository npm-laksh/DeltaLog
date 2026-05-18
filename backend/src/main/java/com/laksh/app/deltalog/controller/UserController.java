package com.laksh.app.deltalog.controller;


import com.laksh.app.deltalog.dto.request.UpdateUserRequestDTO;
import com.laksh.app.deltalog.dto.response.UserResponseDTO;
import com.laksh.app.deltalog.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private final UserService userService;

    // *** get all user in manage user page (ADMIN ACCESS ONLY) ***
    @GetMapping("/get-all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // *** update user info (ADMIN ACCESS ONLY) ***
    @PutMapping("/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateUser(@RequestBody UpdateUserRequestDTO request) {
        userService.updateUser(request);
        return ResponseEntity.ok("User updated successfully");
    }
}
