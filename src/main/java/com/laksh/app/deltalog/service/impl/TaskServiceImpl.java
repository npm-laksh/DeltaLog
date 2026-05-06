package com.laksh.app.deltalog.service.impl;


import com.laksh.app.deltalog.dto.request.TaskRequestDTO;
import com.laksh.app.deltalog.dto.response.TaskResponseDTO;
import com.laksh.app.deltalog.entity.Attendance;
import com.laksh.app.deltalog.entity.Task;
import com.laksh.app.deltalog.entity.User;
import com.laksh.app.deltalog.enums.AttendanceStatus;
import com.laksh.app.deltalog.exception.AttendanceSessionClosed;
import com.laksh.app.deltalog.exception.InvalidActiveSession;
import com.laksh.app.deltalog.exception.InvalidTaskException;
import com.laksh.app.deltalog.exception.UserNotFoundException;
import com.laksh.app.deltalog.mapper.TaskMapper;
import com.laksh.app.deltalog.repository.AttendanceRepo;
import com.laksh.app.deltalog.repository.TaskRepo;
import com.laksh.app.deltalog.repository.UserRepo;
import com.laksh.app.deltalog.service.TaskService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskMapper taskMapper;
    private final UserRepo userRepo;
    private final AttendanceRepo attendanceRepo;
    private final TaskRepo taskRepo;

    @Override
    @Transactional
    public TaskResponseDTO createTask(TaskRequestDTO request) {

        // find user by id
        User user = userRepo.findById(request.userId())
                .orElseThrow(() -> new UserNotFoundException("User not Found.."));

        // validation: find active attendance session
        // if user is not checked in, he cannot create session
        Attendance activeAttendance = attendanceRepo.findByUserAndStatus(user, AttendanceStatus.ACTIVE)
                .orElseThrow(() -> new InvalidActiveSession("Cannot create task, no active session found"));

        // create and populate Task Entity
        Task task = new Task();

        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setDurationMins(request.durationMinutes());
        task.setUser(user);
        task.setAttendance(activeAttendance);

        // save & return DTO
        Task savedTask = taskRepo.save(task);
        return taskMapper.toTaskResponseDTO(savedTask);
    }

    @Override
    public List<TaskResponseDTO> getTaskByAttendance(Integer attendanceId) {
        return taskRepo.findByAttendanceId(attendanceId)
                .stream()

                // convert task entity into dto
                .map(taskMapper::toTaskResponseDTO)

                // collect & store all dtos in a list
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TaskResponseDTO updateTask(Integer taskId, TaskRequestDTO request) {

        // find the existing task
        Task taskToBeUpdated = taskRepo.findById(taskId)
                .orElseThrow(() -> new InvalidTaskException("Task not found"));

        // ensure associate attendance is still ACTIVE
        // cannot update once checked out

        if(taskToBeUpdated.getAttendance().getStatus() != AttendanceStatus.ACTIVE) {
            throw new AttendanceSessionClosed("Cannot update task. Session already Checked Out");
        }

        taskToBeUpdated.setTitle(request.title());
        taskToBeUpdated.setDescription(request.description());
        taskToBeUpdated.setDurationMins(request.durationMinutes());

        // save & return
        Task updatedTask = taskRepo.save(taskToBeUpdated);

        return taskMapper.toTaskResponseDTO(updatedTask);
    }


}
