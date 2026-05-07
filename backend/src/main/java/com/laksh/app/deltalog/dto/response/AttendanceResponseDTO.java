package com.laksh.app.deltalog.dto.response;

import com.laksh.app.deltalog.enums.AttendanceStatus;

import java.time.LocalDateTime;

public record AttendanceResponseDTO(
        int id,
        LocalDateTime checkInTime,
        LocalDateTime checkOutTime,
        int totalWorkMin,
        int overtime,
        int undertime,
        AttendanceStatus status
) {}
