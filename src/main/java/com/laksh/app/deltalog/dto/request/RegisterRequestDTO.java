package com.laksh.app.deltalog.dto.request;

import com.laksh.app.deltalog.enums.UserRole;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequestDTO(@NotBlank String username, @NotBlank String email, @NotBlank String password, UserRole role) {}
