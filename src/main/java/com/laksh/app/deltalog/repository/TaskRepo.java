package com.laksh.app.deltalog.repository;

import com.laksh.app.deltalog.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepo extends JpaRepository<Task, Long> {
}
