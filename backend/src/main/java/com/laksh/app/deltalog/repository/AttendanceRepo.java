package com.laksh.app.deltalog.repository;

import com.laksh.app.deltalog.entity.Attendance;
import com.laksh.app.deltalog.entity.User;
import com.laksh.app.deltalog.enums.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AttendanceRepo extends JpaRepository<Attendance, Integer> {
    Optional<Attendance> findByUserAndStatus(User user, AttendanceStatus status);

    // find the most recent attendance record for the logged-in user
    Optional<Attendance> findFirstByUserOrderByCheckInTimeDesc(User user);
}
