package com.laksh.app.deltalog.repository;

import com.laksh.app.deltalog.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepo extends JpaRepository<Task, Integer> {
    // one attendance session can have n tasks -> store in list
    List<Task> findByAttendanceId(Integer attendanceId);

    // retrieve current logged in user task
    List<Task> findByUserEmail(String email);
}
