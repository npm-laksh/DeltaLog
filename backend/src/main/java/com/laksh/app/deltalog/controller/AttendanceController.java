package com.laksh.app.deltalog.controller;

import com.laksh.app.deltalog.dto.request.CheckInRequestDTO;
import com.laksh.app.deltalog.dto.request.CheckOutRequestDTO;
import com.laksh.app.deltalog.dto.response.AttendanceResponseDTO;
import com.laksh.app.deltalog.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    private final AttendanceService attendanceService;

    @PostMapping("/check-in")
    public ResponseEntity<AttendanceResponseDTO> checkIn(@RequestBody @Validated CheckInRequestDTO request) {
        AttendanceResponseDTO response = attendanceService.checkIn(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/check-out")
    public ResponseEntity<AttendanceResponseDTO> checkOut(@RequestBody CheckOutRequestDTO request) {
        AttendanceResponseDTO response = attendanceService.checkOut(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
