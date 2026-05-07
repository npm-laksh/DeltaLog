package com.laksh.app.deltalog.dto.response;

import java.time.LocalDateTime;

public record TaskResponseDTO(
        Integer id,
        String title,
        String description,
        Integer durationMinutes,
        LocalDateTime createdAt,
        Integer attendanceId
) {
}
