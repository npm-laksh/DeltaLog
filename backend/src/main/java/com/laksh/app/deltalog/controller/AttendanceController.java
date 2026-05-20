package com.laksh.app.deltalog.controller;

import com.laksh.app.deltalog.dto.request.CheckInRequestDTO;
import com.laksh.app.deltalog.dto.request.CheckOutRequestDTO;
import com.laksh.app.deltalog.dto.response.AttendanceResponseDTO;
import com.laksh.app.deltalog.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    private final AttendanceService attendanceService;
//    private final Authentication authentication;

//    @PostMapping("/check-in")
//    public ResponseEntity<AttendanceResponseDTO> checkIn(@RequestBody @Validated CheckInRequestDTO request) {
//        AttendanceResponseDTO response = attendanceService.checkIn(request);
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }

    @PostMapping("/check-in")
    public ResponseEntity<AttendanceResponseDTO> checkIn(Authentication authentication) {
        String email = authentication.getName();
        AttendanceResponseDTO response = attendanceService.checkInByEmail(email);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/check-out")
    public ResponseEntity<AttendanceResponseDTO> checkOut(Authentication authentication) {
        String email = authentication.getName();
        AttendanceResponseDTO response = attendanceService.checkOutByEmail(email);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/latest-attendance")
    public ResponseEntity<AttendanceResponseDTO> getLatest(Authentication auth) {
        return ResponseEntity.ok(attendanceService.getLatestRecord(auth.getName()));
    }

    @GetMapping("/history")
    public ResponseEntity<List<AttendanceResponseDTO>> getUserAttendanceHistory(@RequestParam("email") String email) {
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        List<AttendanceResponseDTO> history = attendanceService.getAttendanceHistoryByEmail(email);
        return ResponseEntity.ok(history);
    }
}
