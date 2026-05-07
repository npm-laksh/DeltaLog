package com.laksh.app.deltalog.dto.response;

import java.time.LocalDateTime;

public record DeleteUserResponseDTO (Integer deletedUserId, String message, LocalDateTime timestamp) {}

