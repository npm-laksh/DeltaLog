package com.laksh.app.deltalog.service.impl;

import com.laksh.app.deltalog.mapper.AttendanceMapper;
import com.laksh.app.deltalog.dto.request.CheckInRequestDTO;
import com.laksh.app.deltalog.dto.request.CheckOutRequestDTO;
import com.laksh.app.deltalog.dto.response.AttendanceResponseDTO;
import com.laksh.app.deltalog.entity.Attendance;
import com.laksh.app.deltalog.entity.User;
import com.laksh.app.deltalog.enums.AttendanceStatus;
import com.laksh.app.deltalog.exception.UserFoundException;
import com.laksh.app.deltalog.exception.UserNotFoundException;
import com.laksh.app.deltalog.repository.AttendanceRepo;
import com.laksh.app.deltalog.repository.UserRepo;
import com.laksh.app.deltalog.service.AttendanceService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {
    private final AttendanceRepo attendanceRepo;
    private final AttendanceMapper attendanceMapper;
    private final UserRepo userRepo;

    @Override
    @Transactional
    public AttendanceResponseDTO checkIn(CheckInRequestDTO request) {

        // find by user by ID
        User user = userRepo.findById(request.userId())
                .orElseThrow(() -> new UserNotFoundException("User with ID: "+request.userId()+" not found"));

        if(attendanceRepo.findByUserAndStatus(user, AttendanceStatus.ACTIVE).isPresent()) {
            throw new UserFoundException("User already active");
        }

        // set user active
        Attendance attendance = new Attendance();
        attendance.setUser(user);
        attendance.setCheckInTime(LocalDateTime.now());
        attendance.setStatus(AttendanceStatus.ACTIVE);

        return attendanceMapper.toAttendanceResponseDTO(attendanceRepo.save(attendance));
    }

    @Override
    @Transactional
    public AttendanceResponseDTO checkOut(CheckOutRequestDTO request) {
        User user = userRepo.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("User with ID: "+request.userId()+" not found"));

        // find active session to close
        Attendance attendance = attendanceRepo.findByUserAndStatus(user, AttendanceStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("No active session found"));

        // set end time & status to completed
        attendance.setCheckOutTime(LocalDateTime.now());
        attendance.setStatus(AttendanceStatus.COMPLETED);

        // set working time metrics
        calculateMetric(attendance);

//        return attendanceMapper.toAttendanceResponseDTO(attendanceRepo.save(attendance));
        Attendance savedAttendanceRec = attendanceRepo.save(attendance);
        return attendanceMapper.toAttendanceResponseDTO(savedAttendanceRec);

    }

    // calculate working mins
    private void calculateMetric(Attendance attendance) {
        long mins = java.time.Duration.between(
                attendance.getCheckInTime(),
                attendance.getCheckOutTime()
        ).toMinutes();

        attendance.setTotalWorkMin((int) mins);

        // standard working hours -> 8 hours -> 480mins
        int standardWorkingHours = 480;

        if(mins > standardWorkingHours) {
            attendance.setOvertime((int) (mins - standardWorkingHours));
            attendance.setUndertime(0);
        } else {
            attendance.setUndertime((int) (standardWorkingHours - mins));
            attendance.setOvertime(0);
        }
    }

    // Inside AttendanceServiceImpl
    // if user did not checkout and logout, check out is done automatically
    @Transactional
    public void completeActiveSession(User user) {
        attendanceRepo.findByUserAndStatus(user, AttendanceStatus.ACTIVE)
                .ifPresent(attendance -> {
                    attendance.setCheckOutTime(LocalDateTime.now());
                    attendance.setStatus(AttendanceStatus.COMPLETED);

                    calculateMetric(attendance);

                    attendanceRepo.save(attendance);
                });
    }
}
