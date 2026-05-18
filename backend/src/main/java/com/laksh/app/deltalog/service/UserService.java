package com.laksh.app.deltalog.service;

import com.laksh.app.deltalog.dto.request.UpdateUserRequestDTO;
import com.laksh.app.deltalog.dto.response.UserResponseDTO;

import java.util.List;

public interface UserService {
    List<UserResponseDTO> getAllUsers();

    void updateUser(UpdateUserRequestDTO request);
}
