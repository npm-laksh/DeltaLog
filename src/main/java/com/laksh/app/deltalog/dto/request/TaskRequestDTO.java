package com.laksh.app.deltalog.dto.request;

public record TaskRequestDTO(
        Integer userId,
        String title,
        String description,
        Integer durationMinutes
) {}
