package com.laksh.app.deltalog.service.impl;

import com.laksh.app.deltalog.exception.ActiveSessionExists;
import com.laksh.app.deltalog.exception.AlreadyCheckedOut;
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
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {
    private final AttendanceRepo attendanceRepo;
    private final AttendanceMapper attendanceMapper;
    private final UserRepo userRepo;

    // check in using ID (decommissioned)
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

    // check out using ID (decommissioned)
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

    @Override
    @Transactional
    public AttendanceResponseDTO checkInByEmail(String email) {

        // define todays time boudaries (00:00:00 - 23:59:59)
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59).withNano(999999999);

        // 1. check if user already had a session today
        Optional<Attendance> existingDailyRec = attendanceRepo
                .findByEmailAndCheckInBetween(email, startOfDay, endOfDay);

        if (existingDailyRec.isPresent()) {
            Attendance rec = existingDailyRec.get();

            // scenario 1: user is currently checked in -> active session
            if (rec.getCheckOutTime() == null) {
                throw new ActiveSessionExists("You are already checked in for today");
            } else {
                throw new AlreadyCheckedOut("You already checked out & completed your shift for today. Pleaase come back tomorrow.");
            }
        }


        // 2. Find user by email (This finds the entity containing the real UUID)
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        // 3. Prevent double check-in
        if(attendanceRepo.findByUserAndStatus(user, AttendanceStatus.ACTIVE).isPresent()) {
            throw new UserFoundException("User is already checked in and active.");
        }

        // 4. Create new attendance record
        Attendance attendance = new Attendance();
        attendance.setUser(user); // JPA handles the UUID foreign key automatically
        attendance.setCheckInTime(LocalDateTime.now());
        attendance.setStatus(AttendanceStatus.ACTIVE);

        return attendanceMapper.toAttendanceResponseDTO(attendanceRepo.save(attendance));
    }

    @Override
    @Transactional
    public AttendanceResponseDTO checkOutByEmail(String email) {
        // 1. Find user by email
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        // 2. Find the active session for this user
        Attendance attendance = attendanceRepo.findByUserAndStatus(user, AttendanceStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("No active work session found for this user."));

        // 3. Close session and calculate metrics
        attendance.setCheckOutTime(LocalDateTime.now());
        attendance.setStatus(AttendanceStatus.COMPLETED);
        calculateMetric(attendance);

        return attendanceMapper.toAttendanceResponseDTO(attendanceRepo.save(attendance));
    }


    // get latest attendace record for logged in user
    @Override
    public AttendanceResponseDTO getLatestRecord(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return attendanceRepo.findFirstByUserOrderByCheckInTimeDesc(user)
                .map(attendanceMapper::toAttendanceResponseDTO)
                .orElse(null); // returns null if user never checked in
    }


    @Override
    public List<AttendanceResponseDTO> getAttendanceHistoryByEmail(String email) {
        return attendanceRepo.findByUserEmail(email)
                .stream()
                .map(attendance -> new AttendanceResponseDTO(
                        attendance.getId(),
                        attendance.getCheckInTime(),
                        attendance.getCheckOutTime(),
                        attendance.getTotalWorkMin(),
                        attendance.getOvertime(),
                        attendance.getUndertime(),
                        attendance.getStatus(),
                        attendance.getUser() != null ? attendance.getUser().getId() : null
                ))
                .collect(Collectors.toList());
    }

}
