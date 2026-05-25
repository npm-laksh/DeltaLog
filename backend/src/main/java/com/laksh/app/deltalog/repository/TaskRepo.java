package com.laksh.app.deltalog.repository;

import com.laksh.app.deltalog.entity.Attendance;
import com.laksh.app.deltalog.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TaskRepo extends JpaRepository<Task, Integer> {
    // one attendance session can have n tasks -> store in list
    List<Task> findByAttendanceId(Integer attendanceId);

    // retrieve current logged in user task
    List<Task> findByUserEmail(String email);

    // find active session that has check in but no check out session yet
    @Query("SELECT a FROM Attendance a WHERE a.user.email = :email AND a.checkOutTime IS NULL")
    Optional<Attendance> findActiveSessionByEmail(@Param("email") String email);

    // sums all durationMinutes for a user between two timestamps (start and end of today)
//    @Query("SELECT COALESCE(SUM(t.durationMins), 0) FROM Task t " +
//            "WHERE t.user.id = :userId " +
//            "AND t.createdAt >= :startOfDay AND t.createdAt <= :endOfDay")
//    int sumDurationMinutesByUserIdAndDate(
//            @Param("userId") Integer userId,
//            @Param("startOfDay") LocalDateTime startOfDay,
//            @Param("endOfDay") LocalDateTime endOfDay
//    );

    @Query("SELECT COALESCE(SUM(t.durationMins), 0) FROM Task t WHERE t.attendance.id = :attendanceId")
    int sumDurationMinutesByAttendanceId(@Param("attendanceId") Integer attendanceId);
}
