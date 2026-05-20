package com.laksh.app.deltalog.mapper;

import com.laksh.app.deltalog.dto.response.AttendanceResponseDTO;
import com.laksh.app.deltalog.entity.Attendance;
import com.laksh.app.deltalog.enums.AttendanceStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AttendanceMapper {

    // convert entity to dto
    public AttendanceResponseDTO toAttendanceResponseDTO(Attendance attendance) {
        return new AttendanceResponseDTO(
                attendance.getId(),
                attendance.getCheckInTime(),
                attendance.getCheckOutTime(),
                attendance.getTotalWorkMin(),
                attendance.getOvertime(),
                attendance.getUndertime(),
                attendance.getStatus(),
                attendance.getUser() != null ? attendance.getUser().getId() : null
        );
    }
}
