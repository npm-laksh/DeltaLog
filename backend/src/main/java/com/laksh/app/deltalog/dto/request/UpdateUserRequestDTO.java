package com.laksh.app.deltalog.dto.request;

import com.laksh.app.deltalog.enums.UserRole;

public record UpdateUserRequestDTO(
        Integer id,
        String username,
        String email,
        String password,
        UserRole role
) {}
