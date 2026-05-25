package com.laksh.app.deltalog.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalState(IllegalStateException ex) {
        Map<String, Object> errorBody = new HashMap<>();
        errorBody.put("status", HttpStatus.BAD_REQUEST.value()); // converts 500 to a clean 400 Bad Request
        errorBody.put("message", ex.getMessage());
        errorBody.put("error", "Validation Failed");

        return new ResponseEntity<>(errorBody, HttpStatus.BAD_REQUEST);
    }
}