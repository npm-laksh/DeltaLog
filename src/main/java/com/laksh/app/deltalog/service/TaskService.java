package com.laksh.app.deltalog.service;

import com.laksh.app.deltalog.dto.request.TaskRequestDTO;
import com.laksh.app.deltalog.dto.response.TaskResponseDTO;

import java.util.List;

public interface TaskService {

    // create task
    TaskResponseDTO createTask(TaskRequestDTO request);

    // get task for each attendance
    List<TaskResponseDTO> getTaskByAttendance(Integer attendanceId);

    // update task
    TaskResponseDTO updateTask(Integer taskId, TaskRequestDTO request);
    // delete task
}
