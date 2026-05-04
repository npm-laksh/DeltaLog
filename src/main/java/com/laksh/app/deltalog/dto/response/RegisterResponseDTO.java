package com.laksh.app.deltalog.dto.response;

import com.laksh.app.deltalog.enums.UserRole;

public record RegisterResponseDTO(
        int id,
        String username,
        String email,
        UserRole role
){}
