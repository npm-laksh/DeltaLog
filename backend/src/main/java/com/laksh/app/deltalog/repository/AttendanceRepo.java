package com.laksh.app.deltalog.repository;

import com.laksh.app.deltalog.entity.Attendance;
import com.laksh.app.deltalog.entity.User;
import com.laksh.app.deltalog.enums.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepo extends JpaRepository<Attendance, Integer> {
    Optional<Attendance> findByUserAndStatus(User user, AttendanceStatus status);

    // find the most recent attendance record for the logged-in user
    Optional<Attendance> findFirstByUserOrderByCheckInTimeDesc(User user);

    // find record for user based on specific day
    @Query("SELECT a FROM Attendance a WHERE a.user = :user AND CAST(a.checkInTime AS date) = :date")
    Optional<Attendance> findByUserAndDate(
            @Param("user") User user,
            @Param("date") LocalDate date
    );

    @Query("SELECT a FROM Attendance a WHERE a.user.email = :email")
    List<Attendance> findByUserEmail(@Param("email") String email);

    @Query("SELECT a FROM Attendance a WHERE a.user.email = :email " + "AND a.checkInTime >= :startOfDay AND a.checkInTime <= :endOfDay")
    Optional<Attendance> findByEmailAndCheckInBetween(
            @Param("email") String email,
            @Param("startOfDay")LocalDateTime startOfDay,
            @Param("endOfDay")LocalDateTime endOfDay
            );
}
