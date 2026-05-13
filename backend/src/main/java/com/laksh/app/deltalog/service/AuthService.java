package com.laksh.app.deltalog.service;

import com.laksh.app.deltalog.dto.request.DeleteUserRequestDTO;
import com.laksh.app.deltalog.dto.request.LoginRequestDTO;
import com.laksh.app.deltalog.dto.request.RegisterRequestDTO;
import com.laksh.app.deltalog.dto.response.DeleteUserResponseDTO;
import com.laksh.app.deltalog.dto.response.LoginResponseDTO;
import com.laksh.app.deltalog.dto.response.RegisterResponseDTO;

public interface AuthService {

    RegisterResponseDTO register(RegisterRequestDTO request);

    LoginResponseDTO login(LoginRequestDTO request);

    DeleteUserResponseDTO deleteUser(DeleteUserRequestDTO request);

//    void logout(Integer userId);

    void logoutByEmail(String email);
}
