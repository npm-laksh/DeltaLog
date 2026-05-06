package com.laksh.app.deltalog.service;

import com.laksh.app.deltalog.dto.request.CheckInRequestDTO;
import com.laksh.app.deltalog.dto.request.CheckOutRequestDTO;
import com.laksh.app.deltalog.dto.response.AttendanceResponseDTO;

public interface AttendanceService {
    AttendanceResponseDTO checkIn(CheckInRequestDTO request);

    AttendanceResponseDTO checkOut(CheckOutRequestDTO request);
}
