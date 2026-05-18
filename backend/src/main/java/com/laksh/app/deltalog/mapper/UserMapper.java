package com.laksh.app.deltalog.mapper;

import com.laksh.app.deltalog.dto.request.RegisterRequestDTO;
import com.laksh.app.deltalog.dto.response.RegisterResponseDTO;
import com.laksh.app.deltalog.dto.response.UserResponseDTO;
import com.laksh.app.deltalog.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    // 1. converting RegisterRequestDTO → User entity
    public User toEntity(RegisterRequestDTO dto) {
        User user = new User();
        user.setUsername(dto.username());
        user.setEmail(dto.email());
        user.setPassword(dto.password());
        user.setRole(dto.role());

        return user;
    }

    // 2. converting Entity to DTO
    public RegisterResponseDTO toRegisterResponseDTO(User user) {
        return new RegisterResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );
    }

    public UserResponseDTO toUserResponseDTO(User user) {
        if (user == null) return null;

        return new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getLastLogin()
        );
    }
}
