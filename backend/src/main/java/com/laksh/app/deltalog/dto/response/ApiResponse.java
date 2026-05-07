package com.laksh.app.deltalog.dto.response;

public record ApiResponse<T>(
        String message,
        T data
) {}
