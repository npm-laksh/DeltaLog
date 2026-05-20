package com.laksh.app.deltalog.service;

import com.laksh.app.deltalog.dto.request.CheckInRequestDTO;
import com.laksh.app.deltalog.dto.request.CheckOutRequestDTO;
import com.laksh.app.deltalog.dto.response.AttendanceResponseDTO;
import com.laksh.app.deltalog.entity.User;

import java.util.List;

public interface AttendanceService {

//    AttendanceResponseDTO checkIn(CheckInRequestDTO request);
//
//    AttendanceResponseDTO checkOut(CheckOutRequestDTO request);

    AttendanceResponseDTO checkInByEmail(String email);

    AttendanceResponseDTO checkOutByEmail(String email);

    AttendanceResponseDTO getLatestRecord(String email);

    void completeActiveSession(User user);

    // get entire attendance history for the user
    List<AttendanceResponseDTO> getAttendanceHistoryByEmail(String email);
}
