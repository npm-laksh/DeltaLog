package com.laksh.app.deltalog.service.impl;

import com.laksh.app.deltalog.dto.request.UpdateUserRequestDTO;
import com.laksh.app.deltalog.dto.response.UserResponseDTO;
import com.laksh.app.deltalog.entity.User;
import com.laksh.app.deltalog.exception.EmailAlreadyExists;
import com.laksh.app.deltalog.exception.UserNotFoundException;
import com.laksh.app.deltalog.mapper.UserMapper;
import com.laksh.app.deltalog.repository.UserRepo;
import com.laksh.app.deltalog.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final UserRepo userRepo;

    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UserResponseDTO> getAllUsers() {
        // 1. Fetch all users from DB
        // 2. Convert each entity to DTO using the mapper
        // 3. Return the list
        return userRepo.findAll()
                .stream()
                .map(userMapper::toUserResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateUser(UpdateUserRequestDTO request) {

        // find existing user
        User user = userRepo.findById(request.id())
                .orElseThrow(() -> new UserNotFoundException("User ID: " + request + "not found"));

        // validate email changes to prevent duplicate emails
        if (!user.getEmail().equals(request.email()) &&
                userRepo.findByEmail(request.email()).isPresent()) {
            throw new EmailAlreadyExists("Email already exists");
        }

        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setRole(request.role());

        // update password if only a new one is provided
        if (request.password() != null && !request.password().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }

        userRepo.save(user);
    }


}
