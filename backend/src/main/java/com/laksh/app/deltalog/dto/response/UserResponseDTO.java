package com.laksh.app.deltalog.dto.response;

import com.laksh.app.deltalog.enums.UserRole;

import java.time.LocalDateTime;

public record UserResponseDTO(
        Integer id,
        String username,
        String email,
        UserRole role,
        LocalDateTime lastLogin
) {}