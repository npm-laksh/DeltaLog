package com.laksh.app.deltalog.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record CheckInRequestDTO(@NotNull(message = "UserId Must not Be Null") Integer userId) {

}
