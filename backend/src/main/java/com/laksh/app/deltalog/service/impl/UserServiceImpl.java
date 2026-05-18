package com.laksh.app.deltalog.service.impl;

import com.laksh.app.deltalog.dto.response.UserResponseDTO;
import com.laksh.app.deltalog.mapper.UserMapper;
import com.laksh.app.deltalog.repository.UserRepo;
import com.laksh.app.deltalog.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final UserRepo userRepo;

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
}
