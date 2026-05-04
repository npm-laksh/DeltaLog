package com.laksh.app.deltalog.repository;

import com.laksh.app.deltalog.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepo extends JpaRepository<Attendance, Long> {
}
