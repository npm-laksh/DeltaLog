package com.laksh.app.deltalog.dto.response;

import com.laksh.app.deltalog.enums.UserRole;

//public record LoginResponseDTO(int id, String username, String email, UserRole role) {}
public record LoginResponseDTO(int id, String username, String email, UserRole role, String messageResponse) {}
//public record LoginResponseDTO(int id, String email, UserRole role) {}
